import React from 'react'
import instructor from '../../../assets/Images/Teacher.jpg'
import { HighlightText } from './HighlightText'
import { CTAButton } from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'

export const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row gap-20 items-center'>
            <div className='w-[50%] '>
                <img 
                src={instructor}
                alt='instructor_image'
                className='shadow-white shadow-[-17px_-17px_0px_rgb(255,255,255)]'/>
            </div>

            <div className='w-[50%] flex flex-col gap-10'>
                <div className='text-4xl font-semibold w-[50%]'>
                    Become an 
                    <HighlightText text={"Instructor"} />
                </div>

                <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                    Instructor from around the world teach millions of students on NeoShiksha. We provide
                    the tools and skills to teach what you love.
                </p>

                <div className='w-fit '>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className='flex flex-row gap-2 items-center'>
                            Start Learning Today
                            <FaArrowRight />
                        </div>
                    </CTAButton>
                </div>

            </div>
        </div>
    </div>
  )
}