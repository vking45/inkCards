#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod factory {

    use ink::prelude::vec::Vec;
    use ink_cards::PoolContractRef;

    #[ink(storage)]
    pub struct Factory {
        deployed_contracts: Vec<AccountId>,
    }

    impl Factory {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                deployed_contracts: Vec::new(),
            }
        }

        #[ink(message)]
        pub fn create_pool(&mut self, pool_name: Vec<u8>) -> AccountId {
            const CODE_HASH: [u8; 32] = [
                0x35, 0xd6, 0x2c, 0x34, 0x8d, 0x50, 0x57, 0xb8, 0xd6, 0x4f, 0x46, 0x36, 0xc4, 0xc8,
                0xcc, 0x28, 0x49, 0xf5, 0xb0, 0xc4, 0x7b, 0xc2, 0xd2, 0x74, 0x72, 0x9a, 0x20, 0x9f,
                0x6c, 0x92, 0xd5, 0xb4,
            ];

            let salt = Hash::from([0x42; 32]);
            // Instantiate the PoolContract
            let pool_instance = PoolContractRef::new(pool_name)
                .code_hash(Hash::from(CODE_HASH))
                .endowment(0)
                .salt_bytes(salt)
                .instantiate();
            // Capture the created contract's AccountId
            let pool_address = pool_instance.get_address();

            self.deployed_contracts.push(pool_address);

            pool_address
        }

        #[ink(message)]
        pub fn get_deployed_contracts(&self) -> Vec<AccountId> {
            self.deployed_contracts.clone()
        }
    }
}
