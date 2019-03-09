import React from 'react'
import successIconUrl from '../../icons/148705-essential-collection/svg/success.svg'
import {useCss} from 'kremling'
import PageHeader from '../page-header.component';

export default function ReportIssueSuccess(props: ReportIssueSuccessProps) {
  const scope = useCss(css)

  return (
    <>
      <PageHeader title="Report an issue" />
      <div className="card issue-success" {...scope}>
        <img src={successIconUrl} className="success-icon" />
        <div>
          Thanks! We'll email you about this, and you can check for updates at any time
          on <a href={`https://github.com/JustUtahCoders/comunidades-unidas-internal/issues/${props.issueId}`} target="_blank">Github Issue #{props.issueId}</a>.
        </div>
      </div>
    </>
  )
}

const css = `
& .issue-success {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

& .success-icon {
  width: 80rem;
  height: 80rem;
  margin-bottom: 16rem;
}
`

type ReportIssueSuccessProps = {
  issueId?: string,
  path: string,
}