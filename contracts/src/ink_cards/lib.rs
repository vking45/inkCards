#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub mod traits;

#[openbrush::implementation(PSP34, Ownable, PSP34Metadata)]
#[openbrush::contract]
pub mod ink_cards {
    use crate::traits::card::*;
    use openbrush::{
        modifiers,
        storage::Mapping,
        traits::{Storage, String},
    };

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct PoolContract {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        ownable: ownable::Data,
        #[storage_field]
        metadata: metadata::Data,

        pool_name: String,
        cards_mapping: Mapping<Id, CardInfo>,
        last_card_id: Id,
    }

    impl PoolContract {
        #[ink(constructor, payable)]
        pub fn new(pool_name: String) -> Self {
            let mut instance = Self::default();
            instance.pool_name = pool_name;
            instance.last_card_id = Id::U128(1);
            metadata::Internal::_set_attribute(
                &mut instance,
                Id::U8(1u8),
                String::from("InkCards NFT"),
                String::from("ICNFTS"),
            );
            ownable::Internal::_init_with_owner(&mut instance, Self::env().caller());

            instance
        }
    }
}
