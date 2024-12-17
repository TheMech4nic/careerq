import React from 'react'
import { InterviewList } from './InterviewList'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const InterviewItemCard = ({interview} : {interview : InterviewList}) => {
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <div className='font-bold text-blue-500'>{interview?.jobPosition}</div>
        <div className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</div>
        <div className='text-xs text-gray-400'>Created At : {moment(interview?.createdAt).format('DD MMM YYYY')}</div>
        <div className='flex items-center justify-between mt-2 gap-5'>
            <Link href={`/dashboard/interview/${interview?.mockId}/feedback`}>
            <Button size='sm' variant={'outline'} className='w-full'>FeedBack</Button>
            </Link>
            <Link className='w-full' href={`/dashboard/interview/${interview?.mockId}`}>
                <Button size='sm' className='w-full'>Start</Button>
            </Link>
        </div>
    </div>
  )
}

export default InterviewItemCard