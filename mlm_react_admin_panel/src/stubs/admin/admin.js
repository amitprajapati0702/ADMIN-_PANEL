// todo - no data found currently, need to check
export const adminStubService = {
    // callTiles: async () => {
    //     const response = {
    //         "ewalletBalance": 4500,
    //         "purchaseWallet": 200,
    //         "creditedAmount": 120,
    //         "creditPercentage": "2000",
    //         "creditSign": "up",
    //         "debitedAmount": 210,
    //         "debitPercentage": "2420",
    //         "debitSign": "down",
    //         "epinBalance": 3420,
    //         "payoutOverview": {
    //             "payoutRequested": 430,
    //             "payoutApproved": 420,
    //             "payoutPaid": 4310,
    //             "payoutRejected": 5430
    //         },
    //         "spentRatio": null,
    //         "balanceRatio": null,
    //         "spent": 550,
    //         "balance": 320
    //     }
    //     return response;
    // },
    callGetAdminList: async () => {
        const response = {
            totalCount: 100,
            totalPages: 10,
            currentPage: 1,
            remainingCount : 10,
            data: Array.from({ length: 10 }, (_, index) => ({
              id: index + 1,
              amount: (Math.random() * 1000).toFixed(2),
              dateAdded: new Date().toLocaleDateString(),
              balance: (index + 1) * 100,
              description: `Transaction ${index + 1}`,
              type: index % 2 === 0 ? "credit" : "debit",
            })),
          };
        return response;
    },
    // callTransferHistory: async () => {
    //     const response =  {
    //         totalCount: 100,
    //         totalPages: 10,
    //         currentPage: 1,
    //         data: Array.from({ length: 10 }, (_, index) => ({
    //           id: index + 1,
    //           amount: (Math.random() * 1000).toFixed(2),
    //           dateAdded: new Date().toLocaleDateString(),
    //           balance: (index + 1) * 100,
    //           description: `Transaction ${index + 1}`,
    //           type: index % 2 === 0 ? "credit" : "debit",
    //         })),
    //       };
    //     return response;
    // },
    // callPurchaseHistory: async () => {
    //     const response = {
    //         "totalCount": 0,
    //         "totalPages": 0,
    //         "currentPage": 1,
    //         "data": []
    //     };
    //     return response;
    // },
    // callMyEarnings: async () => {
    //     const response = {
    //         totalCount: 100,
    //         totalPages: 10,
    //         currentPage: 1,
    //         "dropdown": [
    //             {
    //                 "label": "level_commission",
    //                 "value": "level_commission"
    //             },
    //             {
    //                 "label": "referral",
    //                 "value": "referral"
    //             }
    //         ],
    //         data: Array.from({ length: 10 }, (_, index) => ({
    //             id: index + 1,
    //             dateAdded: new Date().toLocaleDateString(),
    //             description: `Transaction ${index + 1}`,
    //             type: index % 2 === 0 ? "credit" : "debit",
    //             tds: (index + 1) * 100,
    //             serviceCharge: (index + 1) * 100,
    //             amountPayable: (index + 1) * 100,
    //             totalAmount: (index + 1) * 100
    //           })),
    //     };
    //     return response;
    // },
    // callEwalletBalance: async () => {
    //     const response = {};
    //     return response;
    // },
    // callFundTransfer: async () => {
    //     const response = {};
    //     return response;
    // },
};