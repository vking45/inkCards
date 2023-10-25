#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub mod traits;

#[openbrush::implementation(PSP34, Ownable, PSP34Metadata)]
#[openbrush::contract]
pub mod ink_cards {
    use crate::traits::card::*;
    use openbrush::{
        modifiers,
        storage::Mapping,
        traits::{DefaultEnv, Storage, String},
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

    impl Card for PoolContract {
        #[modifiers(only_owner)]
        #[ink(message)]
        fn issue_card(
            &mut self,
            spend_limit: Balance,
            days: u64,
            beneficiary: AccountId,
        ) -> Result<(), PSP34Error> {
            let card_id = self._get_next_card_id_and_increase()?;
            if self.cards_mapping.get(&card_id).is_some() {
                return Err(PSP34Error::Custom(String::from(
                    "This card id already exists!",
                )));
            }
            let expiration = <Self as DefaultEnv>::env().block_timestamp() + (days * 86_400_000);
            let card_info = &CardInfo {
                spent_amount: 0,
                spend_limit: spend_limit,
                expiration: expiration,
            };
            self.cards_mapping.insert(&card_id, card_info);
            psp34::Internal::_mint_to(self, beneficiary, card_id)
        }

        #[ink(message)]
        fn spend_from_card(
            &mut self,
            card_id: Id,
            amount: Balance,
            to_addr: AccountId,
        ) -> Result<(), PSP34Error> {
            let card_info = self.cards_mapping.get(&card_id);
            if card_info.is_none() {
                return Err(PSP34Error::Custom(String::from("Card does not exist")));
            }
            Ok(())
        }

        #[ink(message)]
        fn get_card_info(&self, card_id: Id) -> Result<CardInfo, PSP34Error> {
            let card_info = self.cards_mapping.get(&card_id);
            if card_info.is_none() {
                return Err(PSP34Error::Custom(String::from("Card does not exist")));
            }
            Ok(card_info.unwrap())
        }
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
            ownable::Internal::_init_with_owner(
                &mut instance,
                <Self as DefaultEnv>::env().caller(),
            );

            instance
        }

        fn _get_next_card_id_and_increase(&mut self) -> Result<Id, PSP34Error> {
            match &mut self.last_card_id {
                Id::U128(id) => {
                    let result = Id::U128(id.clone());
                    *id += 1;
                    Ok(result)
                }
                _ => Err(PSP34Error::Custom(String::from("Not expected Id!"))),
            }
        }
    }
}
