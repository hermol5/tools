import axios from "axios";
import { StakerInfoQuery, StakingPools, StakingResult, StarTerraEnergy } from "./ste.interface";
import HttpException from "../common/http-exception";

const lcdStarTerraInstance = axios.create({
    baseURL: 'https://lcd.terra.dev/'
});

const pools: StakingPools = {
    "lunatics": {
        name: "lunatics",
        lp_contract: "terra1pyl3u0v0y7szlj8njctkhys9fvtsl6wva00fd5",
        stt_contract: "terra1ruh00lyqux5g5zjf4gcg66clrkvk7u7e37ntut"
    },
    "interstellars": {
        name: "interstellars",
        lp_contract: "terra1snra29afr9efzt6l34wfnhj3jn90hq6rx8jhje",
        stt_contract: "terra1v6cagryg27qyk7alp7lq35fttkjyn8cmd73fgv"
    },
    "degens": {
        name: "degens",
        lp_contract: "terra1pafra8qj9efnxhv5jq7n4qy0mq5pge8w4k8s2k",
        stt_contract: "terra1z9et2n9ltdqle2s7qq0du2zwr32s3s8ulczh0h"
    }
};

const STE_RATIO: number = 1.2;

export const getSteValue = async (address: string): Promise<StarTerraEnergy> => {
    const currentBlock = await getCurrentBlock();
    const stakerInfo = await getStakerInfo(address, currentBlock);

    return {
        address: address,
        block_time: currentBlock,
        ste_value: calculateSte(stakerInfo),
        lp_amount: stakerInfo.lp_amount,
        stt_amount: stakerInfo.stt_amount
    };
};

const getCurrentBlock = async (): Promise<number> => {
    let result: number = 0;
    try {
        const currentBlockRequest = await lcdStarTerraInstance.get("/blocks/latest");
        const { block } = currentBlockRequest.data;

        result = parseInt(block.header.height);
    } catch (e) {
        console.error((e as HttpException).message);
    }
    return result;
};

const getStakerInfo = async (address: string, block_time: number): Promise<StakingResult> => {
    const query: StakerInfoQuery = {
        staker_info: {
            staker: address,
            block_time: block_time
        }
    }
    const queryStringify = JSON.stringify(query);
    let lp_amount = "";
    let stt_amount = "";

    for (let [pool_name, contracts] of Object.entries(pools)) {
        try {
            let request_lp = await queryContract(contracts.lp_contract, queryStringify);

            if (request_lp.bond_amount !== "0") {
                const request_stt = await queryContract(pools[pool_name].stt_contract, queryStringify);
                lp_amount = request_lp.bond_amount;
                stt_amount = request_stt.bond_amount;
            } else {
                const request_stt = await queryContract(contracts.stt_contract, queryStringify);
                if (request_stt.bond_amount !== "0") {
                    request_lp = await queryContract(pools[pool_name].lp_contract, queryStringify);
                    lp_amount = request_lp.bond_amount;
                    stt_amount = request_stt.bond_amount;
                }
            }
        } catch (e) {
            console.error((e as HttpException).message);
        }
    }

    return {
        lp_amount: parseInt(lp_amount)/1000000,
        stt_amount: parseInt(stt_amount)/1000000
    }
}

const queryContract = async (address: string, message: string) =>
    await lcdStarTerraInstance
        .get(`/wasm/contracts/${address}/store?query_msg=${message}`)
        .then(response => {
            return response.data.result;
        })
        .catch(error => {
            console.error((error as HttpException).message);
        });

const calculateSte = (stakingInfo: StakingResult): number => 
    stakingInfo.stt_amount + (stakingInfo.lp_amount * STE_RATIO);