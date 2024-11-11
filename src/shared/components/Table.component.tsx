import React from 'react';
import { Skeleton, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableProps, TableRow, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Table.component.scss'

export type ColumnItem<T> = {
    key: keyof T;
    label: string;
    colSx?: SxProps<Theme>;
    calSx?: SxProps<Theme>;
    rowClassName?: (row: T) => string;
    colClassName?: string;
    onClick?: (col: string) => void;
    rowRender?: (row: T) => JSX.Element | string;
    colRnder?: () => JSX.Element | string;
};

export type TableCmpProps<T = any> = {
    sx?: SxProps<Theme>;
    columns: ColumnItem<T>[];
    rows: T[];
    rowKey?: string;
    onItemClick?: (row: T) => void;
    isLoading?: boolean;
} & TableProps;
export const TableComponent = (props: TableCmpProps): JSX.Element => {
    const { columns, rows, rowKey, onItemClick, isLoading, ...tableProps } = props;

    const { t } = useTranslation();
    return (<TableContainer>
        <Table {...tableProps}>
            <TableHead>
                <TableRow>
                    {columns.map(({ key, label, colSx, colClassName, onClick, colRnder }) => {
                        return (<TableCell
                            key={String(key)}
                            sx={colSx}
                            className={colClassName}
                            onClick={() => onClick && onClick(String(key))}>
                            {colRnder && colRnder() || t(label)}
                        </TableCell>);
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {!isLoading && rows.map((row, index) => {
                    return (<TableRow sx={{ mt: 1 }} key={rowKey && row[rowKey] || index} onClick={() => onItemClick && onItemClick(row)}>
                        {columns.map(({ key, calSx, rowClassName, rowRender }) => {
                            return (<TableCell
                                key={`${String(key)}${index}`}
                                sx={calSx}
                                scope="row"
                                className={rowClassName && rowClassName(row)}>
                                {rowRender && rowRender(row) || row[key]}
                            </TableCell>);
                        })}
                    </TableRow>);
                })}
                {isLoading && <TableRow>
                    {columns.map(({ key, calSx, }, index) =>
                    (<TableCell
                        key={`${String(key)}${index}`}
                        sx={calSx}
                        scope="row">
                        <Skeleton variant='text' />
                    </TableCell>))}
                    {!isLoading && rows.length == 0 && <TableRow>
                        <TableCell colSpan={columns.length}>
                            no data found
                        </TableCell>
                    </TableRow>}
                </TableRow>}
            </TableBody>
        </Table>
    </TableContainer>);
}