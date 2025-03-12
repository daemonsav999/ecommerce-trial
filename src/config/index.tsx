// frontend/temp_frontend/src/config/index.ts
export const config = {
  // Remove payment related configs
  useTestData: true,  // Enable mock data
  features: {
    social: true,
    groupBuying: true,
    rewards: true,
    payments: false,  // Disable payments
    chat: true
  }
};