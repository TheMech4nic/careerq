"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type InterViewData = {
  id: number,
  jsonMockResp: string,
  jobPosition: string,
  jobDesc: string,
  jobExperience: number,
  createdBy: string,
  createdAt: string,
  mockId: string
}

const Interview = ({ params }: { params: Promise<{ interviewId: string }> }) => {
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
  const [webcamEnabled, setWebcamEnabled] = useState<boolean>(false)

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.interviewId);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (interviewId) {
      console.log(interviewId);
      getInterviewDetails();
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    if (!interviewId) return;
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, interviewId));
    //console.log(result);
    setInterviewData(result[0])
  };

  console.log(interviewData)

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5 p-5">
         <div className="flex flex-col p-5 rounded-lg border gap-5">
            <h2 className="text-lg capitalize"><strong>Job Role/Position : </strong> {interviewData?.jobPosition}</h2>
            <h2 className="text-lg capitalize"><strong>Job Description/Tech Stack : </strong> {interviewData?.jobDesc}</h2>
            <h2 className="text-lg capitalize"><strong>Years Of Experience : </strong> {interviewData?.jobExperience}</h2>
         </div>
         <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
          <h2 className="flex gap-2 items-center text-yellow-600"><Lightbulb/><strong>Information</strong></h2>
          <h2 className="mt-3">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
         </div>
        </div>
        <div>
          {
            webcamEnabled ?
              <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300
                }}
              />
              :
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
          }
          <Button variant="ghost" className="w-full" onClick={() => setWebcamEnabled(!webcamEnabled)}>{webcamEnabled ? 'Disable' : 'Enable'} web cam and microphone</Button>
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className="">Start Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default Interview;