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
                0x37, 0xc4, 0xa9, 0x5c, 0x7c, 0x95, 0x34, 0xa9, 0xc4, 0x7c, 0xbd, 0xe2, 0x92, 0xd0,
                0xec, 0x02, 0x04, 0x7c, 0xe8, 0xab, 0x00, 0xa7, 0x7e, 0xaa, 0x24, 0x03, 0xfd, 0x3b,
                0x44, 0x1b, 0x24, 0x7a,
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
