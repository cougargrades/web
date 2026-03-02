import React from 'react'
import { Link } from '@tanstack/react-router'
import { Chip, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import type { PopulatedGroupResult } from '@cougargrades/models/dto'

import styles from './RelatedGroupList.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export interface RelatedGroupListProps {
  data: PopulatedGroupResult;
  showDescription?: boolean;
  showIdentifier?: boolean;
}

export function RelatedGroupList({ data, showDescription, showIdentifier }: RelatedGroupListProps) {
  return (
    <div>
      <Typography variant="h4" className={styles.h1}>
        {data.name}
      </Typography>
      <Typography gutterBottom variant="body1" color="text.secondary" className={styles.p}>
        {data.description}
      </Typography>
      {
        data.sources.length > 0
        ? <>
        <h6>Sources:</h6> 
        {data.sources.map(e => (
          <Chip key={e.url} label={e.title} className={`${styles.chip} ${interactivity.hoverActive}`} component="a" href={e.url} clickable />
        ))}
        </>
        : null
      }
      {/* <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Here, a &quot;Subject&quot; refers to the 3-4 character prefix before a course number (<em>ex: <abbr title="English">ENGL</abbr>, <abbr title="Mathematics">MATH</abbr></em>)
      </Typography> */}
      <List sx={{ width: '100%' }}>
        { data.relatedGroups.toSorted((a,b) => a.name.replaceAll(/[^\w]/g, '').localeCompare(b.name.replaceAll(/[^\w]/g, ''))).map((item, index, array) => (
          <React.Fragment key={item.identifier}>
            <Link to={item.href} preload="intent" className="nostyle">
              <ListItemButton>
                {
                  showIdentifier
                  ?  <>
                  <ListItemIcon>
                    <Typography variant="h5" color="primary" sx={{ paddingTop: 0 }}>
                      <span style={{ fontSize: '0.7em' }}>{item.identifier}</span>
                    </Typography>
                  </ListItemIcon>
                  </>
                  : null
                }
                <ListItemText
                  slotProps={{
                    secondary: {
                      component: 'div',
                    }
                  }}
                  primary={<>
                  <Typography component="span" variant="inherit" sx={{ fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                  </>}
                  secondary={<>
                  <div className={styles.listItemSecondaryFlex}>
                    {
                      showDescription
                      ? <>
                      <Typography component="span" variant="inherit" className={styles.listItemSecondarySubtitle}>
                        {item.description}
                      </Typography>
                      <Typography component="span" variant="inherit" color="text.disabled">
                        {item.courseCount} courses {/* &bull; {item.sectionCount} sections */}
                      </Typography>
                      </>
                      : <>
                        <Typography component="span" variant="inherit" className={styles.listItemSecondarySubtitle}>
                          {item.courseCount} courses &bull; {item.sectionCount} sections
                        </Typography>
                      </>
                    }
                  </div>
                  </>}
                />
              </ListItemButton>
            </Link>
            {/* <TopListItem data={item} index={index} viewMetric={'activeUsers'} hidePosition /> */}
            { index < (array.length - 1) ? <Divider variant="inset" /> : null }
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}
