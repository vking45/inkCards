#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod factory {

    use ink::prelude::vec::Vec;
    use ink_cards::PoolContractRef;
    use openbrush::traits::String;

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
        pub fn create_pool(&mut self, pool_name: String) -> AccountId {
            const CODE_HASH: [u8; 32] = [
                0x3f, 0x16, 0xb1, 0x98, 0x30, 0x95, 0x5f, 0x8d, 0x8d, 0xf5, 0x93, 0x7c, 0xad, 0x2f,
                0x16, 0x24, 0xcc, 0x6f, 0xc8, 0xee, 0xca, 0x0c, 0x8d, 0xdc, 0x1b, 0xf4, 0xb2, 0x8f,
                0xb1, 0x06, 0x91, 0xe1,
            ];
            // Instantiate the PoolContract
            let pool_instance = PoolContractRef::new(pool_name)
                .code_hash(Hash::from(CODE_HASH))
                .endowment(0)
                .salt_bytes(self.env().block_timestamp().to_le_bytes())
                .instantiate();
            // Capture the created contract's AccountId
            let pool_address = pool_instance.get_address();
            // Store the address in our list
            self.deployed_contracts.push(pool_address);
            pool_address
        }

        #[ink(message)]
        pub fn get_deployed_contracts(&self) -> Vec<AccountId> {
            self.deployed_contracts.clone()
        }
    }
}
