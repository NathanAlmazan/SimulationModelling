import React from 'react';
import { sentenceCase } from 'change-case';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";

const SupplierMoreMenu = dynamic(() => import('./SupplierMoreMenu'));
const Label = dynamic(() => import("../../Label"));

function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#bcdbbc",
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

function SupplierBody(props) {
    const { suppliers, position } = props;
    return (
        <TableBody>
            {suppliers.map((row) => {
                const { id, full_name, company_name, contact_number, email, total_collecting, is_active } = row;

                return (
                <TableRow
                    hover
                    key={id}
                    tabIndex={-1}
                    role="checkbox"
                >
                    <TableCell />
                    <TableCell component="th" scope="row" padding="none">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar {...stringAvatar(full_name)} />
                        <Typography variant="subtitle2" noWrap>
                        {full_name}
                        </Typography>
                    </Stack>
                    </TableCell>
                    <TableCell align="left">{company_name}</TableCell>
                    <TableCell align="left">{email}</TableCell>
                    <TableCell align="left">{contact_number}</TableCell>
                    <TableCell align="left">
                    <Label
                        variant="ghost"
                        color={(total_collecting > 0 && 'error') || 'success'}
                    >
                        {sentenceCase(total_collecting === 0 ? 'Fulfiled' : 'Collecting' )}
                    </Label>
                    </TableCell>

                    <TableCell align="right">
                    <SupplierMoreMenu onHead={false} id={id} isActive={is_active} onCredit={Boolean(total_collecting > 0)} position={position} />
                    </TableCell>
                </TableRow>
                );
            })}
        </TableBody>
    )
}

export default SupplierBody
