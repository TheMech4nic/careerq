import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

const Dashboard = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2>Start your mockup interview</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 my-5'>
        <AddNewInterview />
      </div>
      <InterviewList />
    </div>
  )
}

export default Dashboard