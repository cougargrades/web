import markdownStyles from './faqpostbody.module.scss'

export function FaqPostBody({ content }) {
  return (
    <div>
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}