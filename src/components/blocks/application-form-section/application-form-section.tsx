'use client'

import { useRef, useState, type ChangeEvent } from 'react'

import { ArrowRightIcon, BadgeCheckIcon, ClockIcon, FileTextIcon, ShieldCheckIcon, UploadIcon, XIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const formBenefits = [
  {
    icon: ClockIcon,
    title: 'Fast review',
    description: 'Submit your details online and let our team review your eligibility promptly.'
  },
  {
    icon: FileTextIcon,
    title: 'Simple documents',
    description: 'Prepare IC, SSM, EPF, bank statement, and utility bill for verification.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Licensed process',
    description: 'Your application is handled through a transparent KPKT-licensed workflow.'
  }
]

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ApplicationFormSection = () => {
  const [documents, setDocuments] = useState<File[]>([])
  const documentsInputRef = useRef<HTMLInputElement>(null)

  const handleDocumentsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])

    if (selectedFiles.length === 0) {
      return
    }

    setDocuments(currentDocuments => [...currentDocuments, ...selectedFiles])
    event.target.value = ''
  }

  const handleRemoveDocument = (indexToRemove: number) => {
    setDocuments(currentDocuments => currentDocuments.filter((_, index) => index !== indexToRemove))
  }

  return (
    <section id='application-form' className='scroll-mt-20 py-4 sm:py-8 lg:py-10'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8'>
        <div className='flex flex-col justify-center space-y-6'>
          <div className='space-y-4'>
            <Badge variant='outline' className='text-sm font-normal'>
              Loan Application
            </Badge>
            <h2 className='text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl'>
              Apply for business funding online
            </h2>
            <p className='text-muted-foreground text-xl'>
              Share your contact and business details so our financing team can guide you through the next step.
            </p>
          </div>

          <div className='grid gap-4'>
            {formBenefits.map(item => (
              <div key={item.title} className='flex gap-4'>
                <div className='border-primary/20 bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full border'>
                  <item.icon className='size-5' />
                </div>
                <div>
                  <h3 className='font-semibold'>{item.title}</h3>
                  <p className='text-muted-foreground'>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className='bg-background rounded-none shadow-none'>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <BadgeCheckIcon className='text-primary size-5' />
              <CardTitle className='text-2xl'>Start your application</CardTitle>
            </div>
            <CardDescription className='text-base'>
              Fill in the form below. This front-end form is ready for a future CRM, email, or webhook connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='grid gap-5'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='full-name' className='text-sm font-medium'>
                    Full name
                  </label>
                  <Input id='full-name' name='fullName' placeholder='Your full name' autoComplete='name' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='phone' className='text-sm font-medium'>
                    Phone number
                  </label>
                  <Input id='phone' name='phone' placeholder='017-1234567' autoComplete='tel' />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium'>
                    Email address
                  </label>
                  <Input id='email' name='email' type='email' placeholder='you@example.com' autoComplete='email' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='company' className='text-sm font-medium'>
                    Company name
                  </label>
                  <Input id='company' name='company' placeholder='Registered business name' />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <label htmlFor='loan-amount' className='text-sm font-medium'>
                    Loan amount
                  </label>
                  <Input id='loan-amount' name='loanAmount' placeholder='RM 50,000' inputMode='numeric' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='business-type' className='text-sm font-medium'>
                    Business type
                  </label>
                  <select
                    id='business-type'
                    name='businessType'
                    className='border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm'
                    defaultValue=''
                  >
                    <option value='' disabled>
                      Select business type
                    </option>
                    <option value='sole-proprietor'>Sole proprietor</option>
                    <option value='partnership'>Partnership</option>
                    <option value='sdn-bhd'>Sdn. Bhd.</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>

              <div className='space-y-2'>
                <label htmlFor='message' className='text-sm font-medium'>
                  Financing purpose
                </label>
                <textarea
                  id='message'
                  name='message'
                  placeholder='Tell us briefly how the financing will support your business.'
                  className='border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full rounded-md border px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm'
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='documents' className='text-sm font-medium'>
                  Supporting documents
                </label>
                <label
                  htmlFor='documents'
                  className='border-input bg-background hover:bg-primary/5 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-center transition-colors'
                >
                  <UploadIcon className='text-primary size-5' />
                  <span className='font-medium'>Upload IC, SSM, EPF, bank statement, or utility bill</span>
                  <span className='text-muted-foreground text-sm'>PDF, JPG, PNG, or WebP files</span>
                </label>
                <Input
                  id='documents'
                  name='documents'
                  ref={documentsInputRef}
                  type='file'
                  multiple
                  accept='.pdf,.jpg,.jpeg,.png,.webp'
                  className='sr-only'
                  onChange={handleDocumentsChange}
                />
                {documents.length > 0 && (
                  <div className='grid gap-2'>
                    {documents.map((document, index) => (
                      <div
                        key={`${document.name}-${document.lastModified}-${index}`}
                        className='border-input bg-background flex items-center justify-between gap-3 rounded-md border px-3 py-2'
                      >
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-medium'>{document.name}</p>
                          <p className='text-muted-foreground text-xs'>{formatFileSize(document.size)}</p>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='size-8 shrink-0 rounded-full'
                          onClick={() => handleRemoveDocument(index)}
                        >
                          <XIcon className='size-4' />
                          <span className='sr-only'>Remove {document.name}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type='button'
                size='lg'
                className='group relative w-fit overflow-hidden rounded-full text-base before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] has-[>svg]:px-6 dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]'
              >
                Submit application
                <ArrowRightIcon className='transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ApplicationFormSection
