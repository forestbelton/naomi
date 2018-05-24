module Main where

import Control.Concurrent
import Control.Concurrent.Chan
import Control.Monad
import Network.WebSockets
import Wuss

import Naomi.Packet (Packet)

main :: IO ()
main = runSecureClient "gateway.discord.gg" 443 "/" naomiClient

naomiClient :: ClientApp ()
naomiClient conn = do
    packetChan <- newChan

    void . forkIO . forever $ do
        packet <- receiveData conn
        print (packet :: Packet)
        writeChan packetChan packet

    forever $ threadDelay 100
