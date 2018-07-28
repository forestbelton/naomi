package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.command.coinflip.CoinFlipCommand
import com.github.forestbelton.naomi.command.eightball.EightBallCommand

val allCommands = arrayOf(
    CoinFlipCommand(),
    EightBallCommand()
)
