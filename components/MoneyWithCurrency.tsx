import { formatCurrency } from '@/utils/numberUtils'
import { cx } from 'class-variance-authority'
import React from 'react'

interface MoneyWithCurrencyProps {
    amount: number
}

const MoneyWithCurrency = ({ amount }: MoneyWithCurrencyProps) => {
    return (
        <span>
            {formatCurrency(amount)}
        </span>
    )
}

export default MoneyWithCurrency