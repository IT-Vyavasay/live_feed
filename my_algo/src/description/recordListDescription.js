import React from 'react'

const recordListDescription = () => {
    const recordListConfig = {
        pendingOrderList: {
            title: "Pending Order List",
            apiEndpoint: "pending-order",
        },
        currentOrderList: {
            title: "Current Order List",
            apiEndpoint: "current-order",
        },
        closeOrderList: {
            title: "Close Order List",
            apiEndpoint: "close-order",
        },
    }
    return {
        recordListConfig
    }
}

export default recordListDescription