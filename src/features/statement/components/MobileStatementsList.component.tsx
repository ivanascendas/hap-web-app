import React, { useEffect } from 'react';
import { StatementDto } from '../../../shared/dtos/statement.dtos';
import moment from 'moment';
import { Box, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import currency from '../../../shared/utils/currency';
import './MobileStatementsList.component.scss';

export type MobileStatementsListProps = {
    list: StatementDto[];
    onClick?: (statement: StatementDto) => void;
    loadMore: () => void;
}
export const MobileStatementsListComponent = ({ list, loadMore, onClick }: MobileStatementsListProps): JSX.Element => {
    const [statements, setStatements] = React.useState<{ [yearMounth: string]: StatementDto[] }>({});

    useEffect(() => {
        const statementsByYearMounth: { [yearMounth: string]: StatementDto[] } = {};
        list.forEach((statement: StatementDto) => {
            const yearMounth = moment(statement.statementDate).format('MMM YYYY');
            if (!statementsByYearMounth[yearMounth]) {
                statementsByYearMounth[yearMounth] = [];
            }
            statementsByYearMounth[yearMounth].push(statement);
        });
        setStatements(statementsByYearMounth);
    }, [list]);

    return (<Box className="table-statements-mobile">
        {Object.keys(statements).map((yearMounth: string) =>
        (<Box className="table-statements-mobile_group" key={yearMounth}>
            <Box className="table-statements-mobile_group_header">{yearMounth}</Box>

            <Box className="table-statements-mobile_group_list">
                {statements[yearMounth].map((statemet, i) =>
                    <Button onClick={() => onClick && onClick(statemet)} key={yearMounth + i} className="table-statements-mobile_group_list_item ripple">
                        <Box sx={{ width: '60px !important', flex: 'none' }}>
                            <Box className="table-statements-mobile_group_list_item_date">
                                <span>{moment(statemet.statementDate).format("DD")}</span>
                                {moment(statemet.statementDate).format("MMM")}
                            </Box>
                        </Box>

                        <Box className="table-statements-mobile_group_list_item_referance">
                            {statemet.invoiceNo}
                        </Box>

                        <Box className={`table-statements-mobile_group_list_item_amount ${statemet.transType == 'Invoice' ? 'text_red' : 'clr_green'}`}>
                            {currency.format(statemet.amount)}
                        </Box>
                        <Box className="table-statements-mobile_group_list_item_chevron">
                            <ChevronRightIcon fontSize="large" />
                        </Box>
                    </Button>)}
            </Box>
        </Box>))}
    </Box>);
}