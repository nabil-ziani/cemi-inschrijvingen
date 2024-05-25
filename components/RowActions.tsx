import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DeleteIcon, EditIcon, EyeIcon } from "@/components/Icons"
import { Row } from '@tanstack/react-table'
import { Enrollment } from '@/queries/get_enrollments_by_year'

interface RowActionsProps {
    row: Row<Enrollment>
}

const RowActions = ({ row }: RowActionsProps) => {

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                        <EyeIcon />
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Details</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger>
                    <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                        <EditIcon />
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Wijzig</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger color='danger'>
                    <span className='cursor-pointer text-lg text-danger active:opacity-50'>
                        <DeleteIcon />
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Verwijder</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default RowActions