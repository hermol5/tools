export interface StarTerraEnergy {
    address: string;
    block_time: number;
    ste_value: number;
    stt_amount: number;
    lp_amount: number;
}

export interface StakerInfoQuery {
    staker_info: StakerInfo;
}

export interface StakerInfo {
    staker: string;
    block_time: number;
}

export interface StakingPool {
    name: string;
    lp_contract: string;
    stt_contract: string;
}

export interface StakingPools {
    [key: string]: StakingPool;
}

export interface StakingResult {
    lp_amount: number;
    stt_amount: number;
}