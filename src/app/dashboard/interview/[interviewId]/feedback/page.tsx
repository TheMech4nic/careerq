"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../../utils/db'
import { UserAnswer } from '../../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type FeedBackList = {
  id: number,
  mockIdRef: string,
  question: string,
  correctAns: string,
  userAns: string,
  feedback: string,
  rating: string,
  userEmail: string,
  createdAt: string
}

const FeedBack = ({ params }: { params: Promise<{ interviewId: string }> }) => {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [feedbackList, setFeedBackList] = useState<FeedBackList[]>([
    {
      id: 0,
      mockIdRef: "",
      question: "",
      correctAns: "",
      userAns: "",
      feedback: "",
      rating: "",
      userEmail: "",
      createdAt: ""
    }
  ]);

  const router = useRouter();

  useEffect(() => {
    console.log('params', params)
    const fetchParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.interviewId);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    console.log("feed back mounted")
    getFeedBack();
  }, [params])


  const getFeedBack = async () => {
    console.log(interviewId)
    if (!interviewId) return;
    const result = await db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, interviewId)).orderBy(UserAnswer.id);
    console.log(result)
    const formattedResult: FeedBackList[] = result.map((item) => ({
      id: item.id || 0,
      mockIdRef: item.mockIdRef || '',
      question: item.question || '',
      correctAns: item.correctAns || '',
      userAns: item.userAns || '',
      feedback: item.feedback || '',
      rating: item.rating || '',
      userEmail: item.userEmail || '',
      createdAt: item.createdAt || '',
    }));

    setFeedBackList(formattedResult);
  }

  console.log(feedbackList)



  return (
    <div className='p-10'>
      {
        feedbackList?.length == 0 ?
          <h2 className='font-bold text-xl text-gray-500'>No interview feedback found</h2> :
          <>
            <h2 className='text-blue-600 text-lg my-3'>Your overall interview rating : <strong>7/10</strong></h2>
            <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>
            {
              feedbackList && feedbackList.map((item, index) => (
                <Collapsible key={index} className='mt-7'>
                  <CollapsibleTrigger className='w-full p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-10'>{item.question} <ChevronsUpDown /></CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='flex flex-col gap-2'>
                      <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating: </strong>{item.rating}</h2>
                      <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer : </strong>{item.userAns}</h2>
                      <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer : </strong>{item.correctAns}</h2>
                      <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback : </strong>{item.feedback}</h2>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            }
          </>
      }

      <div className='flex items-end justify-end my-5'>
        <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
      </div>
    </div>
  )
}

export default FeedBack