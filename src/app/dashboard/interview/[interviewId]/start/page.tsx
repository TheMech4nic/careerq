"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../../utils/db';
import { MockInterview } from '../../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { InterViewData } from '../page';
import QuestionsSection from './_component/QuestionsSection';
import RecordAnsSection from './_component/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type MockInterviewQuestion = {
  answer: string;
  question: string;
}[];

const StartInterview = ({ params }: { params: Promise<{ interviewId: string }> }) => {
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [interviewData, setInterviewData] = useState<InterViewData>({
    id: 0,
    jsonMockResp: "",
    jobPosition: "",
    jobDesc: "",
    jobExperience: 0,
    createdBy: "",
    createdAt: "",
    mockId: ""
  });
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState<MockInterviewQuestion | null>(null);
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.interviewId);
    };

    fetchParams();
  }, [params]);
  console.log("start", interviewId)
  useEffect(() => {
    console.log("called useffecrt");
    
    getInterviewDetails();
  }, [interviewId])
  

  const getInterviewDetails = async () => {
    console.log("called")
    if (!interviewId) return;
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
    console.log(result)
    //console.log(result);
    setInterviewData(result[0])
    const jsonMockResp: MockInterviewQuestion = JSON.parse(result[0]?.jsonMockResp.trim().replace('```json', '').replaceAll('```', '')) || [];
      console.log(jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
    
  };

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} />

        <RecordAnsSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData}/>
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex > 0 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
        {activeQuestionIndex !== (mockInterviewQuestion &&mockInterviewQuestion?.length-1) &&<Button onClick={() => setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
        <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
          {activeQuestionIndex === (mockInterviewQuestion &&mockInterviewQuestion?.length-1) && <Button>End Interview</Button>}
        </Link>
      </div>
    </div>
  )
}

export default StartInterview
