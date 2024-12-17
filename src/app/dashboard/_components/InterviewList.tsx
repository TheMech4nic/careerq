"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../utils/db';
import { MockInterview, UserAnswer } from '../../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import InterviewItemCard from './InterviewItemCard';

export type InterviewList = {
    createdAt: string;
    createdBy: string;
    id: number;
    jobDesc: string;
    jobExperience: number;
    jobPosition: string;
    jsonMockResp: {
      question: string;
      answer: string;
    }[];
    mockId: string;
  };

const InterviewList = () => {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState<InterviewList[]>([]);
    useEffect(() => {
        const emailAddress = user?.primaryEmailAddress?.emailAddress || '';
        getInterviewList(emailAddress);
    }, [user])
    

    const getInterviewList = async(emailAddress : string) => {
        if(!emailAddress) return ;
        const result = await db.select().from(MockInterview).where(eq(MockInterview.createdBy, emailAddress)).orderBy(desc(MockInterview.id));

        console.log('interveiewlist', result);
        const formattedResult: InterviewList[] = result.map((item) => ({
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            id: item.id,
            jobDesc: item.jobDesc,
            jobExperience: item.jobExperience,
            jobPosition: item.jobPosition,
            jsonMockResp: JSON.parse(item.jsonMockResp.trim().replace('```json', '').replaceAll('```', '')),
            mockId: item.mockId,
          }));
        
          setInterviewList(formattedResult);
    }
  return (
    <div>
        <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {
                interviewList && interviewList.map((interview, index) => (
                    <InterviewItemCard
                        interview={interview}
                        key={index}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default InterviewList