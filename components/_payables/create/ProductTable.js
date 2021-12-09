import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dynamic from "next/dynamic";

const Scrollbar = dynamic(() => import("../../Scrollbar"));


export default function ProductTable(props) {
    const { orderProducts, handleQuantityBlur, charges, discount, totalPrice, removeProduct, handlePriceBlur } = props;
    const addCharge = charges !== "" ? charges : 0;
    const discounted = discount !== "" ? discount : 0;
   
    return (
            <Scrollbar>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                    <TableCell align="center" colSpan={3}>
                        Details
                    </TableCell>
                    <TableCell align="right">Price</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell sx={{ width: "50%" }}>Product Name</TableCell>
                    <TableCell align="right">Supplier Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Sum</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orderProducts.map(product => {
                    const { id, name, init_price, quantity, orderSum } = product;

                    return (
                    <TableRow key={id}>
                        <TableCell sx={{ width: "40%" }}>{name}</TableCell>
                        <TableCell align="right">
                            <TextField 
                                defaultValue={!init_price ? "" : init_price}
                                onBlur={event => handlePriceBlur(event, id)}
                                sx={{ maxWidth: 100 }}
                                inputProps={{min: 1, style: { textAlign: 'right' }}}
                                type="number"
                                variant="standard"
                            />
                        </TableCell>
                        <TableCell align="right">
                            <TextField 
                                defaultValue={!quantity ? "" : quantity}
                                onBlur={event => handleQuantityBlur(event, id)}
                                sx={{ maxWidth: 100 }}
                                inputProps={{min: 1, style: { textAlign: 'right' }}}
                                type="number"
                                variant="standard"
                            />
                        </TableCell>
                        <TableCell align="right">{!orderSum ? 0.00 : `₱ ${orderSum.toFixed(2)}`}</TableCell>
                        <TableCell>
                            <IconButton onClick={event => removeProduct(event, id)}>
                                <DeleteOutlineIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    )}
                    )}

                    {orderProducts.length === 0 ?  (
                    <TableRow>
                        <TableCell colSpan={4}>No products selected.</TableCell>
                    </TableRow>
                    ) : (
                    <>
                        <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell align="right">{totalPrice !== "" && `₱ ${totalPrice.toFixed(2)}`}</TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell colSpan={2}>Amount Due</TableCell>
                        <TableCell align="right">
                            {totalPrice !== "" && `₱ ${(totalPrice + addCharge - discounted).toFixed(2)}`}
                        </TableCell>
                        </TableRow>
                    </>
                    )}

                    
                </TableBody>
                </Table>
            </Scrollbar>
    )
}