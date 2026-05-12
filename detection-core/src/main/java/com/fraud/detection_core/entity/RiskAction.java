package com.fraud.detection_core.entity;

public enum RiskAction {
    ALLOW,
    ALLOW_WITH_FLAG,
    CHALLENGE_MFA,
    REVIEW,
    BLOCK,
    BLOCK_AND_ALERT,
    BLOCK_AND_REVIEW
}