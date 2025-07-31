// todo - no data found currently, need to check
export const dashboardStubService = {
  
  appLayout: async () => {
    const response = {
      "companyProfile": {
        "name": "company name",
        "logo": null,
        "address": "company address",
        "favicon": null,
        "email": "company@company.com",
        "phone": "123456789"
      },
      "languages": [],
      "menu": {
        "sideMenus": [
          {
            "id": 1,
            "title": "Dashboard",
            "slug": "dashboard",
            "userIcon": "dashboard_ico.svg",
            "is_child": 0,
            "MenuPermission": {
              "userPermission": 1
            },
            "subMenu": [],
            "ecomLink": false,
            "isMain": true
          },
          {
            "id": 2,
            "title": "Genral Settings",
            "slug": "general-settings",
            "userIcon": "tool.svg",
            "is_child": 0,
            "MenuPermission": {
              "userPermission": 1
            },
            "subMenu": [],
            "ecomLink": false,
            "isMain": true
          },
          {
            "id": 3,
            "title": "Staff",
            "slug": "staff",
            "userIcon": "user_ico.svg",
            "is_child": 0,
            "MenuPermission": {
              "userPermission": 1
            },
            "subMenu": [],
            "ecomLink": false,
            "isMain": true
          },
          {
            "id": 4,
            "title": "Role",
            "slug": "role",
            "userIcon": "role_icon.svg",
            "is_child": 0,
            "MenuPermission": {
              "userPermission": 1
            },
            "subMenu": [],
            "ecomLink": false,
            "isMain": true
          },
          // {
          //   "id": 112,
          //   "title": "Networks",
          //   "slug": "networks",
          //   "userIcon": "network_ico.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [
          //     {
          //       "id": 145,
          //       "title": "Tree View",
          //       "slug": "tree-view",
          //       "parentId": 112,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     },
          //     {
          //       "id": 146,
          //       "title": "Genealogy Tree",
          //       "slug": "genealogy-tree",
          //       "parentId": 112,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     },
          //     {
          //       "id": 148,
          //       "title": "Downline Members",
          //       "slug": "downline-members",
          //       "parentId": 112,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     }
          //   ],
          //   "ecomLink": false,
          //   "isMain": true
          // },
          // {
          //   "id": 126,
          //   "title": "Register",
          //   "slug": "register",
          //   "userIcon": "user_ico.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [],
          //   "ecomLink": false,
          //   "isMain": true
          // },
          // {
          //   "id": 116,
          //   "title": "E Wallet",
          //   "slug": "e-wallet",
          //   "userIcon": "wallet_ico.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [],
          //   "ecomLink": false,
          //   "isMain": true
          // },
          // {
          //   "id": 117,
          //   "title": "Payout",
          //   "slug": "payout",
          //   "userIcon": "payout_ico.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [],
          //   "ecomLink": false,
          //   "isMain": true
          // },
          // {
          //   "id": 127,
          //   "title": "Shopping",
          //   "slug": "shopping",
          //   "userIcon": "shopping-cart-white.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [],
          //   "ecomLink": false
          // },
          // {
          //   "id": 115,
          //   "title": "Tools",
          //   "slug": "tools",
          //   "userIcon": "tool.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [
          //     {
          //       "id": 167,
          //       "title": "Download Materials",
          //       "slug": "download-materials",
          //       "parentId": 115,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     },
          //     {
          //       "id": 169,
          //       "title": "News",
          //       "slug": "news",
          //       "parentId": 115,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     },
          //     {
          //       "id": 170,
          //       "title": "Faqs",
          //       "slug": "faqs",
          //       "parentId": 115,
          //       "userIcon": null,
          //       "MenuPermission": {
          //         "userPermission": 1
          //       }
          //     }
          //   ],
          //   "ecomLink": false
          // },
          // {
          //   "id": 119,
          //   "title": "Mail Box",
          //   "slug": "mailbox",
          //   "userIcon": "mail.svg",
          //   "is_child": 0,
          //   "MenuPermission": {
          //     "userPermission": 1
          //   },
          //   "subMenu": [],
          //   "ecomLink": false
          // }
        ],
        "topMenus": [
          {
            "id": 119,
            "title": "Mail Box",
            "slug": "mail-box",
            "userIcon": "mail.svg",
            "is_child": 0,
            "MenuPermission": {
              "userPermission": 1
            },
            "subMenu": []
          }
        ],
        "spclMenu": {
          "id": 127,
          "title": "Shopping",
          "slug": "shopping",
          "userIcon": "shopping-cart-white.svg",
          "is_child": 0,
          "MenuPermission": {
            "userPermission": 1
          },
          "subMenu": [],
          "ecomLink": false
        },
        "quickMenus": [
          {
            "id": 167,
            "title": "Download Materials",
            "slug": "download-materials",
            "parentId": 115,
            "userIcon": null,
            "MenuPermission": {
              "userPermission": 1
            },
            "quickIcon": "fa fa-download"
          },
          {
            "id": 169,
            "title": "News",
            "slug": "news",
            "parentId": 115,
            "userIcon": null,
            "MenuPermission": {
              "userPermission": 1
            },
            "quickIcon": "fa-regular fa-newspaper"
          },
          {
            "id": 170,
            "title": "Faqs",
            "slug": "faqs",
            "parentId": 115,
            "userIcon": null,
            "MenuPermission": {
              "userPermission": 1
            },
            "quickIcon": "fa-solid fa-question"
          }
        ]
      },
      "mailCount": 0,
      "notificationCount": 3,
      "isPreset": 0,
      "configuration": {
        "tds": 5,
        "serviceCharge": 10,
        "pairValue": 100,
        "regAmount": 0,
        "maxPinCount": 500,
        "transFee": 10,
        "roiPeriod": "daily",
        "roiDaysSkip": "",
        "apiKey": "69652",
        "treeIconBased": "profile_image",
        "treeDepth": 4,
        "treeWidth": 3
      },
      "moduleStatus": {
        "mlm_plan": "Unilevel",
        "pin_status": 0,
        "product_status": 1,
        "mailbox_status": 1,
        "rank_status": 0,
        "captcha_status": 0,
        "multi_currency_status": 0,
        "lead_capture_status": 0,
        "ticket_system_status": 0,
        "ecom_status": 0,
        "autoresponder_status": 0,
        "lcp_type": "lcp",
        "payment_gateway_status": 1,
        "repurchase_status": 0,
        "google_auth_status": 0,
        "package_upgrade": 0,
        "roi_status": 0,
        "xup_status": 0,
        "hyip_status": 0,
        "kyc_status": 0,
        "subscription_status": 0,
        "promotion_status": 0,
        "multilang_status": 0,
        "replicated_site_status": 0,
        "purchase_wallet": 1,
        "tutorial_status": 0
      },
      "user": {
        "id": 2,
        "name": "Member1 Test",
        "username": "INF00123",
        "userType": "user",
        "activeStatus": 1,
        "email": "rohanpatel769853@gmail.com",
        "emailVerified": 0,
        "defaultCurrency": null,
        "defaultLang": null,
        "image": null,
        "tutorial": 0
      }
    };
    return response;
  },
  // dashboardTiles: async () => {
  //   const response = {
  //     "ewallet": 200,
  //     "commission": 100,
  //     "commissionPercentage": 10,
  //     "commissionSign": "up",
  //     "totalCredit": 400,
  //     "totalCreditPercentage": 20,
  //     "creditSign": "up",
  //     "totalDebit": 200,
  //     "totalDebitPercentage": 11,
  //     "debitSign": "up"
  //   }
  //   return response;
  // },
  // dashboardProfile: async () => {
  //   const response = {
  //     "userProfile": {
  //       "username": "INF00123",
  //       "fullname": "Member1 Test",
  //       "sponsorName": "B7WSAZGHH",
  //       "packageName": "Membership Pack3",
  //       "rankName": null,
  //       "image": null,
  //       "personalPv": 150,
  //       "groupPv": 100,
  //       "upgradeLink": null,
  //       "renewLink": null,
  //       "kycStatus": 0,
  //       "subscriptionDetails": {}
  //     },
  //     "replicaLink": [
  //       {
  //         "name": "Replica Link",
  //         "icon": "copy.svg",
  //         "link": "https://user.infinitemlmsoftware.com/replica/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "Facebook",
  //         "icon": "facebook.svg",
  //         "link": "https://www.facebook.com/sharer/sharer.php?u=https://user.infinitemlmsoftware.com/replica/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "X",
  //         "icon": "twitter.svg",
  //         "link": "https://twitter.com/share?url=https://user.infinitemlmsoftware.com/replica/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "LinkedIn",
  //         "icon": "linkedin.svg",
  //         "link": "http://www.linkedin.com/shareArticle?url=https://user.infinitemlmsoftware.com/replica/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       }
  //     ],
  //     "leadCaptureLink": [
  //       {
  //         "name": "Lead Capture Link",
  //         "icon": "copy.svg",
  //         "link": "https://user.infinitemlmsoftware.com/lcp/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "Facebook",
  //         "icon": "facebook.svg",
  //         "link": "https://www.facebook.com/sharer/sharer.php?u=https://user.infinitemlmsoftware.com/lcp/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "X",
  //         "icon": "twitter.svg",
  //         "link": "https://twitter.com/share?url=https://user.infinitemlmsoftware.com/lcp/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       },
  //       {
  //         "name": "LinkedIn",
  //         "icon": "linkedin.svg",
  //         "link": "http://www.linkedin.com/shareArticle?url=https://user.infinitemlmsoftware.com/lcp/INF00123/b7wsazghh/eb0f67b5fc875ca46abe0554be89104c2b191b6e752cf06144132f5754d34467"
  //       }
  //     ],
  //     "payoutOverview": {
  //       "payoutRequested": 30,
  //       "payoutApproved": 21,
  //       "payoutPaid": 43,
  //       "payoutRejected": 10
  //     },
  //     "payoutDoughnut": {
  //       "pending": 5,
  //       "approved": 3,
  //       "paid": 39
  //     }
  //   };
  //   return response;
  // },
  // getGraph: async (keyFrame = 'month') => {
  //   console.log(keyFrame)
  //   let response;
  //   if (keyFrame === 'month') {
  //     response = {
  //       "Mar 24": 20,
  //       "Apr 24": 12,
  //       "May 24": 76,
  //       "Jun 24": 90,
  //       "Jul 24": 11,
  //       "Aug 24": 24,
  //       "Sep 24": 38,
  //       "Oct 24": 10,
  //       "Nov 24": 55,
  //       "Dec 24": 68,
  //       "Jan 25": 81,
  //       "Feb 25": 98
  //     };
  //   }

  //   else if (keyFrame === 'day') {
  //     response = {
  //       "Fri": 34,
  //       "Sat": 64,
  //       "Sun": 12,
  //       "Mon": 62,
  //       "Tue": 120,
  //       "Wed": 129,
  //       "Thu": 165
  //     }
  //   }
  //   else {
  //     response = {
  //       "2020": 10,
  //       "2021": 34,
  //       "2022": 54,
  //       "2023": 64,
  //       "2024": 34,
  //       "2025": 76
  //     }
  //   }
  //   return response;
  // },
  // multiCurrencyUpdation: async () => {
  //   const response = {};
  //   return response;
  // },
  // multiLanguageUpdation: async () => {
  //   const response = {};
  //   return response;
  // },
  // notificationCall: async () => {
  //   const response = {
  //     "totalCount": 3,
  //     "totalPages": 1,
  //     "currentPage": 1,
  //     "data": [
  //       {
  //         "request_id": "notif_001",
  //         "id": 1,
  //         "image": "https://cdn-icons-png.flaticon.com/512/711/711769.png", 
  //         "title": "New message received",
  //         "date": "2025-02-06T10:30:00Z"
  //       },
  //       {
  //         "request_id": "notif_002",
  //         "id": 2,
  //         "image": "https://cdn-icons-png.flaticon.com/512/711/711769.png", 
  //         "title": "Your order has been shipped",
  //         "date": "2025-02-05T15:45:00Z"
  //       },
  //       {
  //         "request_id": "notif_003",
  //         "id": 3,
  //         "image": "https://cdn-icons-png.flaticon.com/512/711/711769.png", 
  //         "title": "Reminder: Meeting at 3 PM",
  //         "date": "2025-02-06T08:00:00Z"
  //       }
  //     ]
  //   };
  //   return response;
  // },
  // ReadAllNotification: async () => {
  //   const response = {};
  //   return response;
  // },
  // dashboardDetails: async () => {
  //   const response = {
  //     "newMembers": [
  //       {
  //         "name": "John",
  //         "secondName": "Doe",
  //         "username": "johndoe123",
  //         "dateOfJoining": "2024-01-15",
  //         "image": "https://imgs.search.brave.com/egS01BTq3uN7FKzaV07PgOVOl0JiRAT-lbvTdtWLz3k/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzczLzc3LzAw/LzM2MF9GXzE3Mzc3/MDA2OF9MUlF5TlVa/UW45V3RReUpvSnNP/RXdLOHF3Qnp5cEJt/MC5qcGc",
  //         "gender": "M"
  //       },
  //       {
  //         "name": "Jane",
  //         "secondName": "Smith",
  //         "username": "janesmith456",
  //         "dateOfJoining": "2024-02-01",
  //         "image": "https://imgs.search.brave.com/XP_NbqTqOctorRk48Ze9bqK8SHZt8Q2jrmUwGhH5crM/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8w/NS8wOS8xMy8yOS9w/aG90b2dyYXBoZXIt/NTE0OTY2NF8xMjgw/LmpwZw",
  //         "gender": "F"
  //       },
  //       {
  //         "name": "Alex",
  //         "secondName": "Brown",
  //         "username": "alexbrown789",
  //         "dateOfJoining": "2024-02-05",
  //         "image": "https://imgs.search.brave.com/X28BexU1ncBTTjnHTH7YTRDbDZOHMh2Ob0oySgMw-tk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8w/Ni8wOS8xMC81Mi9t/YW4tNTI3NzkwM182/NDAuanBn",
  //         "gender": "M"
  //       }
  //     ],
  //     "topEarners": [
  //       {
  //         "name": "Michael",
  //         "username": "michael_99",
  //         "image": null,
  //         "balanceAmount": 5000
  //       },
  //       {
  //         "name": "Sophia",
  //         "username": "sophia_star",
  //         "image": null,
  //         "balanceAmount": 7500
  //       },
  //       {
  //         "name": "Daniel",
  //         "username": "dan_the_man",
  //         "image": null,
  //         "balanceAmount": 6200
  //       }
  //     ],
  //     "earnings": [
  //       {
  //         "amountType": "commission",
  //         "amount": 1500
  //       },
  //       {
  //         "amountType": "bonus",
  //         "amount": 2500
  //       },
  //       {
  //         "amountType": "referralReward",
  //         "amount": 1200
  //       },
  //       {
  //         "amountType": "leadershipBonus",
  //         "amount": 3000
  //       }
  //   ],
  //     "ranks": [],
  //     "currentRank": null
  //   };
  //   return response;
  // },
  // topRecruiters: async () => {
  //   const response = [
  //     {
  //       "name": "Emma Johnson",
  //       "username": "emma_j",
  //       "image": null,
  //       "count": 25
  //     },
  //     {
  //       "name": "Liam Anderson",
  //       "username": "liam_anderson",
  //       "image": null,
  //       "count": 18
  //     },
  //     {
  //       "name": "Olivia Martinez",
  //       "username": "olivia_m",
  //       "image": null,
  //       "count": 30
  //     }
  //   ];
  //   return response;
  // },
  // packageOverview: async () => {
  //   const response = [
  //     {
  //       "id": 1,
  //       "name": "Membership Pack1",
  //       "image": null,
  //       "count": 3
  //     },
  //     {
  //       "id": 2,
  //       "name": "Membership Pack2",
  //       "image": null,
  //       "count": 2
  //     },
  //     {
  //       "id": 3,
  //       "name": "Membership Pack3",
  //       "image": null,
  //       "count": 10
  //     }
  //   ];
  //   return response;
  // },
  // rankOverview: async () => {
  //   const response = {};
  //   return response;
  // },
  // dashboardExpenses: async () => {
  //   const response = [
  //     {
  //       "amountType": "commission",
  //       "amount": 100
  //     },
  //     {
  //       "amountType": "bonus",
  //       "amount": 500
  //     },
  //     {
  //       "amountType": "referralReward",
  //       "amount": 200
  //     },
  //     {
  //       "amountType": "leadershipBonus",
  //       "amount": 200
  //     }
  // ];
  //   return response;
  // },
  // endTutorial: async () => {
  //   const response = {};
  //   return response;
  // },
  // readnotification: async () => {
  //   const response = {};
  //   return response;
  // },
};