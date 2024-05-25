import { formatCurrency } from '@/utils/numberUtils'
import { cx } from 'class-variance-authority'
import React from 'react'

interface MoneyWithCurrencyProps {
    amount: number
}

const MoneyWithCurrency = ({ amount }: MoneyWithCurrencyProps) => {
    return (
        // logica moet anders voor woensdag- en zondagklas
        <span className={cx({
            'text-destructive': amount < 220
        })}>
            {formatCurrency(amount)}
        </span>
    )
}

export default MoneyWithCurrency