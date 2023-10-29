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
                0xe5, 0x82, 0xc5, 0xd4, 0xc5, 0x2c, 0x72, 0x59, 0xda, 0x34, 0x66, 0xd6, 0xac, 0x8f,
                0x4f, 0x21, 0x94, 0xd7, 0x4c, 0x40, 0x1f, 0x76, 0x7e, 0xd9, 0xa8, 0x55, 0xff, 0x41,
                0x6b, 0x88, 0xdd, 0xb0,
            ];

            let salt = Hash::from([0x42; 32]);
            // Instantiate the PoolContract
            let pool_instance = PoolContractRef::new(pool_name, self.env().caller())
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
