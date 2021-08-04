import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useWindowSize } from 'react-use'
import List from '@material-ui/core/List'
import ListItemButton from '@material-ui/core/ListItemButton'
import ListItemText from '@material-ui/core/ListItemText'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListSubheader from '@material-ui/core/ListSubheader'
import { useAllGroups } from '../lib/data/useAllGroups'
import { selectedGroupResultKey } from '../lib/recoil'
import { GroupRow } from '../components/grouprow'

import styles from './groupnav.module.scss'
//import hoverStyles from '../styles/hover.module.scss'

export function GroupNav() {
  const { data, status } = useAllGroups();
  const [selected, setSelected] = useRecoilState(selectedGroupResultKey);
  const { width } = useWindowSize()
  const condensed = width < 768;

  useEffect(() => {
    console.log('selected?', selected);
  }, [selected])

  return (
    <>
    { status === 'success' ? data.categories.map(cat => (
      <List key={cat} className={styles.sidebarList}
        subheader={
          <ListSubheader component="div" sx={{ color: (theme) => (condensed ? undefined : theme.palette.text.primary) }} className={styles.listSubHeader}>
            {cat}
          </ListSubheader>
        }>
        {data.results[cat].map((e, index) => (
          condensed ? 
          <Accordion
            key={e.key}
            classes={{ root: styles.accordionRoot, expanded: styles.accordionRootExpanded }}
            defaultExpanded={false}
            >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{e.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <GroupRow data={e} />
            </AccordionDetails>
          </Accordion>
          :
          <ListItemButton
            key={e.key}
            selected={e.key === selected}
            onClick={() => setSelected(e.key)}
            classes={{ root: styles.accordionRoot, selected: styles.listItemSelected }}
            dense
            >
            <ListItemText primary={e.title} primaryTypographyProps={{ color: (theme) => (e.key === selected) ? theme.palette.text.primary : theme.palette.text.secondary, fontWeight: 'unset' }} />
          </ListItemButton>
        ))}
      </List>
    )) : <></>
    }
    </>
  );
}

interface GroupContentProps {
  groupId: string;
}

export function GroupContent({ groupId }: GroupContentProps) {
  return (
    <div style={{ fontSize: '2rem'}}>
    <h1>{groupId}</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt consectetur volutpat. Donec pellentesque a lacus ut volutpat. Morbi consectetur augue at nibh eleifend maximus ac ut lacus. Morbi at scelerisque ex, sit amet aliquet lacus. Morbi nec facilisis ligula. Phasellus ipsum metus, ornare ultrices egestas non, dictum fermentum nulla. In hac habitasse platea dictumst. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer nisl nisl, dictum non nulla at, mattis dignissim ex. Mauris tristique mattis fermentum. Integer et enim id ex molestie vehicula. Vestibulum consectetur pretium sem eu mattis. Nullam malesuada, tortor sed venenatis imperdiet, neque ex pulvinar purus, vulputate vehicula sapien lacus et leo. Aenean at posuere lacus. </p>
    <p>Sed placerat luctus imperdiet. Integer in urna a erat dignissim rutrum. Quisque sit amet consectetur neque, id pellentesque nulla. Mauris ut ultrices libero. Aenean in dictum mi. Etiam eu nisl ipsum. Suspendisse ornare ante vitae lacinia pharetra. </p>
    <h2>BBBBBBBBBBBBBBBBBBBBBB</h2>
    <p>Nulla venenatis pulvinar pulvinar. Etiam vitae neque massa. Aliquam non egestas orci, faucibus scelerisque elit. Mauris nec diam eu mauris semper laoreet sed in tortor. Praesent vestibulum convallis nisl, ut porttitor ipsum lacinia vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis feugiat maximus scelerisque. Duis vehicula ac eros ut hendrerit. Vivamus ultrices, mi a elementum consectetur, dui metus dictum justo, vitae dignissim orci eros eu urna. </p>
    <h3>CCCCCCCCCCCCCCCCCCCCCCCC</h3>
    <p>In convallis imperdiet nunc, ut pretium mi tempor eget. Donec commodo dolor in tortor rutrum, quis facilisis lorem commodo. In enim nisi, aliquet eget nunc vitae, volutpat lacinia enim. Nam eu tristique purus, id pretium massa. Maecenas a scelerisque tortor. Quisque vehicula quis dolor eget aliquam. Quisque rutrum sagittis tellus. Donec porta vel dui non malesuada. </p>
    <h3>DDDDDDDDDDDDDDDDDDDDDDDD</h3>
    <p>Aliquam dui leo, tristique sed faucibus sit amet, consectetur vitae elit. Aliquam eros neque, aliquam in velit ac, lobortis tempor lectus. Maecenas pretium egestas tempor. Quisque vulputate nunc ac dolor sodales interdum. Integer finibus nunc nulla, sed suscipit risus condimentum sed. Mauris congue nisi non elit iaculis, nec vulputate lacus lacinia. Quisque porta a nibh ac gravida. Quisque ac nunc cursus, placerat ex et, imperdiet turpis. Nunc volutpat laoreet lorem, in dictum nulla finibus eu. Maecenas pellentesque nec orci facilisis finibus. </p>
    </div>
  )
}
