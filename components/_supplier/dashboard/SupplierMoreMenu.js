import { useRef, useState, useEffect } from 'react';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useRouter } from 'next/router';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { getSession } from 'next-auth/client';
import API_CLIENT_SIDE from '../../../layouts/APIConfig';
import axios from 'axios';
// ----------------------------------------------------------------------

export default function SupplierMoreMenu(props) {
  const { onHead, handleFilterMenu, id, isActive, onCredit, position } = props;
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const history = useRouter();
  const baseURL = API_CLIENT_SIDE();
  const ExecutivePosition = ["President", "Vice President", "Manager"];

  const onRouterClick = (e, path) => {
    history.push(path)
  }

  useEffect(() => {
    async function getUser() {
      const currUser = await getSession();

      if (!currUser) {
        history.push("/signin");
      }

      setAccessToken(state => currUser.access_token);
    }

    getUser();
  }, [history])

  const handleUnarchived = async () => {
    try {
        await axios({
            url: `${baseURL}/payables/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + accessToken,
            },
            data: {
            query: `
                mutation UnArchiveSupplier ($ID: Int!) {
                  UnArchiveSupplier (supplierId: $ID) {
                        id
                    }
                }
            `,
            variables: {
                ID: id,
                }
            }
        });

        history.reload();
    } catch (err) {
        if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err.response);
            }
        } else {
            history.push("/");
        }
    }
  }

  const handleArchive = async () => {
    try {
        await axios({
            url: `${baseURL}/payables/graphql`,
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'KEY ' + accessToken,
            },
            data: {
            query: `
              mutation archiveSupplier ($ID: Int!) {
                archiveSupplier (supplierId: $ID) {
                      id
                  }
              }
            `,
            variables: {
                ID: id,
                }
            }
        });

        history.reload();
    } catch (err) {
        if (err.response) {
            if (err.response.data.error === "Invalid Token") {
                history.push("/signin");
            } else {
                console.log(err.response);
            }
        } else {
            history.push("/");
        }
    }
  }

  const handleFilterMenuChange = (order, orderBy) => {
    handleFilterMenu(order, orderBy);
    setIsOpen(false)
  }

  if (onHead) {
    return (
        <>
          <IconButton ref={ref} onClick={() => setIsOpen(true)}>
            <FilterListIcon />
          </IconButton>

          <Menu
            open={isOpen}
            anchorEl={ref.current}
            onClose={() => setIsOpen(false)}
            PaperProps={{
              sx: { width: 200, maxWidth: '100%' }
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={event => handleFilterMenuChange("desc", "total_supplied")} sx={{ color: 'text.secondary' }}>
              <ListItemText primary="Total Supplied: High-Low" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>

            <MenuItem onClick={event => handleFilterMenuChange("asc", "total_supplied")} sx={{ color: 'text.secondary' }}>
              <ListItemText primary="Total Supplied: Low-High" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          </Menu>
        </>
    );
  }

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={e => onRouterClick(e, '/suppliers/profile/' + id)} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        {ExecutivePosition.includes(position) && (
          !isActive ? (
            <MenuItem onClick={() => handleUnarchived()} sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                < UnarchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Restore" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          ): (
            <MenuItem disabled={onCredit} onClick={() => handleArchive()} sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                < ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Archive" primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}
