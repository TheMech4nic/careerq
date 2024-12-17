"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "../../../../utils/GeminiAiModel";
import { LoaderCircle } from "lucide-react";
import { db } from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { User } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
import moment from 'moment/moment'
import { useRouter } from "next/navigation";

type CandidateExp = {
    role: string;
    stack: string;
    experience: number;
};

const AddNewInterview = () => {
    const [openDailog, setOpenDailog] = useState<boolean>(false);
    const [formInput, setFormInput] = useState<CandidateExp>({
        role: "",
        stack: "",
        experience: 0,
    });

    const [loading, setLoading] = useState<boolean>(false);

    const [jsonResponse, setJsonResponse] = useState<[]>([]);
    const { user } = useUser();
    const route = useRouter();

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    };

    const changeEventTextAreaHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFormInput({ ...formInput, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const inputPrompt = `Job Position : ${formInput.role}, Job Description :${formInput.stack}, years of experience : ${formInput.experience}, depend on the information please give me ${process.env.NEXT_PUBLIC_INTERVEIW_QUESTION_COUNT} interview question with answered in json format, give question and answered as field in JSON`;

        try {
            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '')
            setJsonResponse(mockJsonResp);

            if (mockJsonResp) {
                const response = await db.insert(MockInterview)
                    .values({
                        jsonMockResp: mockJsonResp,
                        jobPosition: formInput?.role,
                        jobDesc: formInput?.stack,
                        jobExperience: Number(formInput?.experience),
                        createdBy: user?.primaryEmailAddress?.emailAddress || 'email_not_found',
                        createdAt: moment(new Date()).format('DD-MM-yyyy'),
                        mockId: uuidv4()
                    })
                    .returning({ mockId: MockInterview.mockId });
                if (response) {
                    setOpenDailog(false);
                    route.push(`/dashboard/interview/${response[0]?.mockId}`)
                }
            } else {
                console.error('NO RESPONSE')
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDailog(true)}
            >
                <span className="text-md text-center block">+Add New</span>
            </div>
            <Dialog open={openDailog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interviewing
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <div>
                            {/* Replace <p> with <div> to avoid nesting issues */}
                            <div>
                                Add details about your job position/role, job description, and years of experience.
                            </div>
                            <form onSubmit={submitHandler}>
                                <div className="mt-7 my-3">
                                    <label htmlFor="role">Job Role/Job Positions</label>
                                    <Input
                                        id="role"
                                        placeholder="Ex. Full Stack Developer"
                                        required
                                        name="role"
                                        className="text-black"
                                        onChange={changeEventHandler}
                                    />
                                </div>
                                <div className="my-3">
                                    <label htmlFor="stack">Job Description/Tech Stack (In short)</label>
                                    <Textarea
                                        id="stack"
                                        placeholder="Ex. React, Angular, NodeJs, MySql etc."
                                        required
                                        name="stack"
                                        className="text-black"
                                        onChange={changeEventTextAreaHandler}
                                    />
                                </div>
                                <div className="my-3">
                                    <label htmlFor="experience">Years of Experience</label>
                                    <Input
                                        id="experience"
                                        placeholder="Ex. 5"
                                        type="number"
                                        required
                                        name="experience"
                                        className="text-black"
                                        onChange={changeEventHandler}
                                    />
                                </div>
                                <div className="flex gap-5 justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpenDailog(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            "Start Interview"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogDescription>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;
