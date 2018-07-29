package com.github.forestbelton.naomi.command

import com.github.forestbelton.naomi.command.commands.coinflip.CoinFlipCommand
import com.github.forestbelton.naomi.command.commands.eightball.EightBallCommand
import com.github.forestbelton.naomi.command.commands.qdb.QdbCommand
import com.github.forestbelton.naomi.command.commands.quit.QuitCommand

val allCommands = arrayOf(
    CoinFlipCommand(),
    EightBallCommand(),
    QuitCommand(),
    QdbCommand()
)
