import { useRouter } from 'next/router'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Emoji } from './emoji'


export default function Panko() {
  const router = useRouter();

  return (
    <Breadcrumbs  aria-label="breadcrumb">
      {generateBreadcrumbs(router.asPath)}
    </Breadcrumbs>
  )
}

export function PankoRow() {
  return (
    <div className="new-container">
      <Panko />
    </div>
  )
}

export function generateBreadcrumbs(path: string) {
  return path.split('/').map((value, index) => {
    const key = `${index}|${value}`
    if(index === 0) {
      return <span key={key}>Home</span>
    }
    if(index === 1) {
      if(value.toLowerCase() === 'c') {
        return <span key={key}><Emoji label="books" symbol="📚" />Courses</span>
      }
      if(value.toLowerCase() === 'i') {
        return <span key={key}><Emoji label="teacher" symbol="👩‍🏫" />Instructors</span>
      }
      if(value.toLowerCase() === 'g') {
        return <span key={key}><Emoji label="file box" symbol="🗃️" />Groups</span>
      }
    }
    return <span key={key}>{value}</span>
  })
}
