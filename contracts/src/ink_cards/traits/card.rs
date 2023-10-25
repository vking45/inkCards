use openbrush::{
    contracts::traits::{
        ownable::*,
        psp34::{extensions::metadata::*, *},
    },
    traits::{AccountId, Balance, Timestamp},
};

#[cfg(feature = "std")]
use ink::storage::traits::StorageLayout;

#[derive(Debug, Clone, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(StorageLayout, scale_info::TypeInfo))]
pub struct CardInfo {
    pub spent_amount: Balance,
    pub spend_limit: Balance,
    pub expiration: Timestamp,
}

impl Default for CardInfo {
    fn default() -> Self {
        Self {
            spent_amount: Balance::default(),
            spend_limit: Balance::default(),
            expiration: Timestamp::default(),
        }
    }
}

#[openbrush::wrapper]
pub type CardRef = dyn Card + PSP34 + PSP34Metadata + Ownable;

#[openbrush::trait_definition]
pub trait Card: PSP34 + PSP34Metadata + Ownable {
    #[ink(message)]
    fn issue_card(
        &mut self,
        spend_limit: Balance,
        days: u64,
        beneficiary: AccountId,
    ) -> Result<(), PSP34Error>;

    #[ink(message)]
    fn spend_from_card(
        &mut self,
        card_id: Id,
        amount: Balance,
        to_addr: AccountId,
    ) -> Result<(), PSP34Error>;

    #[ink(message)]
    fn get_card_info(&self, card_id: Id) -> Result<CardInfo, PSP34Error>;
}
