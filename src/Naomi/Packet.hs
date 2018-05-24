{-# LANGUAGE DeriveGeneric #-}
module Naomi.Packet where

import Data.Aeson
import Data.Maybe
import Data.Text
import GHC.Generics
import Network.WebSockets

data Packet = Packet
    { op :: Int
    , d  :: Value
    , s  :: Maybe Int
    , t  :: Maybe Text
    } deriving (Generic, Show)

instance ToJSON Packet where
    toEncoding = genericToEncoding defaultOptions

instance FromJSON Packet

instance WebSocketsData Packet where
    fromLazyByteString = fromJust . decode
    toLazyByteString = encode
    fromDataMessage (Text bs _) = fromLazyByteString bs
    fromDataMessage (Binary bs) = fromLazyByteString bs
