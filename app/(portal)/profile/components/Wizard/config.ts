import { FormPage } from '@/app/components/Form/types'

export const wizardFormPages: FormPage[] = [
  {
    title: 'Personal Information',
    description: 'Please provide your personal details.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name'
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        placeholder: 'Date of Birth'
      }
    ]
  },
  {
    title: 'Contact Information',
    description: 'How can we reach you?',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address'
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter your phone number'
      }
    ]
  },
  {
    title: 'Personal Information',
    description: 'Please provide your personal details.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name'
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date'
      }
    ]
  },
  {
    title: 'Contact Information',
    description: 'How can we reach you?',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address'
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter your phone number'
      }
    ]
  },
  {
    title: 'Personal Information',
    description: 'Please provide your personal details.',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter your first name'
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter your last name'
      },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date'
      }
    ]
  },
  {
    title: 'Contact Information',
    description: 'How can we reach you?',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address'
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: 'Enter your phone number'
      }
    ]
  }
]
