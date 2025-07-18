import React from 'react'
import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineImage from '../../../assets/Images/time_line_image.jpg'

const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description: "Fully committed to the success company",
    },

    {
        Logo: Logo2,
        heading: "Responsiblity",
        Description: "Students will always be our top priority",
    },

    {
        Logo: Logo3,
        heading: "Flexiblity",
        Description: "The ability to switch is an important skill",
    },

    {
        Logo: Logo4,
        heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
]

const TimelineSection = () => {
  return (
    <div>
        <div className='flex flex-row items-center gap-15'>
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeline.map((element, index) => {
                        return(
                            <div className='flex flex-row gap-6 ' key={index}>

                                <div className='w-[50px] h-[50px] bg-white rounded-full justify-center flex items-center'>
                                    <img src={element.Logo} alt='Logos'/>
                                </div>

                                <div>
                                    <h2 className='font-semibold text-[18px]'>
                                        {element.heading}
                                    </h2>

                                    <p className='text-base '>{element.Description}</p>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

            <div className='relative shadow-blue-200'>
                <img src={timelineImage} alt='timeLineImage' 
                className='shadow-white h-fit' />

                <div className='absolute bg-caribbeangreen-700 flex flex-row py-7 uppercase text-white
                left-[50%] translate-x-[-50%] translate-y-[-50%]'>

                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>

                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>years of Experience</p>

                    </div>

                    <div className='flex gap-5 items-center px-7'>

                        <p className='text-3xl font-bold '>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>

                    </div>

                </div>

            </div>
        </div>

    </div>
  )
}

export default TimelineSection