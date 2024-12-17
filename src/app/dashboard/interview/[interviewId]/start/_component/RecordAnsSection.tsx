"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import webCamImg from '../../../../../../../public/webcam.png'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { toast } from 'sonner'
import { MockInterviewQuestion } from '../page'
import { chatSession } from '../../../../../../../utils/GeminiAiModel'
import { db } from '../../../../../../../utils/db'
import { UserAnswer } from '../../../../../../../utils/schema'
import { InterViewData } from '../../page'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'

const RecordAnsSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }: { mockInterviewQuestion: MockInterviewQuestion | null, activeQuestionIndex: number, interviewData: InterViewData }) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });
  useEffect(() => {
    if (results) {
      results.forEach((result) => {
        if (typeof result === 'object' && 'transcript' in result) {
          setUserAnswer((prevAns) => prevAns + result.transcript);
        } else if (typeof result === 'string') {
          setUserAnswer((prevAns) => prevAns + result);
        }
      });
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && mockInterviewQuestion) {
      updateUserAnswer();
    }
  }, [userAnswer]);

  useEffect(() => {
    console.log(isRecording)
  }, [isRecording])
  


  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText()
    }
  }

  const updateUserAnswer = async () => {
    if (mockInterviewQuestion) {
      setLoading(true);
      console.log('updateUserAnswer', userAnswer)
      if (userAnswer?.length < 10) {
        toast.error('Error while saving your answer, please record again')
        setLoading(false);
        return;
      }
      const feedBackPrompt = "Question" + (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]?.question) + ", User Answer:" + userAnswer + ", Depends on question and user answer for give interview question please give us rating for answer and feedback as area of imporvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";
      const result = await chatSession.sendMessage(feedBackPrompt);
      console.log(result.response.text())
      const mockJsonResp = (result.response.text()).replace('```json', '').replaceAll('```', '');
      console.log(mockJsonResp)
      const jsonFeedBackResp = JSON.parse(mockJsonResp);

      console.log(interviewData)

      const res = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonFeedBackResp?.feedback,
        rating: jsonFeedBackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })
      if (res) {
        toast('User answer recorded suuccessfully');
      }
      setUserAnswer('');
      setResults([]);
      setLoading(false);
    }
  }


  return (
    <div className='flex flex-col justify-center'>
      <div className='flex flex-col my-20 justify-center items-center  bg-black rounded-lg p-5'>
        <Image src={webCamImg} alt='Web Cam' width={200} height={200} className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10
          }}
        />
      </div>
      <Button variant={'outline'} disabled={loading} onClick={startStopRecording} className='my-10' >
        {isRecording ?
          <h2 className='text-red-600 flex items-center gap-2'>
            <StopCircle /> <span>Stop Recording</span>
          </h2>
          :
          <h2 className='flex items-center'>
            <Mic /> <span>Record Answer</span>
          </h2>
        }

      </Button>
      
    </div>
  )
}

export default RecordAnsSection