use openbrush::{
    contracts::traits::{
        ownable::*,
        psp34::{extensions::metadata::*, *},
    },
    traits::{Balance, Timestamp},
};

#[cfg(feature = "std")]
use ink::storage::traits::StorageLayout;

#[derive(Debug, Clone, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(StorageLayout, scale_info::TypeInfo))]
pub struct CardInfo {
    pub spend_limit: Balance,
    pub expiration: Timestamp,
}

impl Default for CardInfo {
    fn default() -> Self {
        Self {
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
    fn issue_card(&mut self, card_info: CardInfo) -> Result<(), PSP34Error>;
}
