import * as React from 'react'; // eslint-disable-line no-unused-vars

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {Card, CardText} from 'material-ui/Card';

import LoadingSmall from '../components/LoadingSmall.react';

export default function CardTable({
  headerText,
  tableClassName,
  rows = [],
  rowKey,
  onAdd
}) {
  const noRowContent = (
    <div>
      <h3>{headerText}</h3>
      <div style={{width: '100%', height: '100px'}}>
        <LoadingSmall />
      </div>
    </div>
  );
  const tableRows = rows.map((row, i) => {
    const key = rowKey(i);
    const cols = row.map((col) => <TableRowColumn key={key}>{col}</TableRowColumn>);
    return <TableRow key={key}>{cols}</TableRow>;
  });
  const card = (
    <Card initiallyExpanded={true} className='big-card'>
      <CardText expandable={false}>
        <Table selectable={false} className={tableClassName}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn colSpan={rows.length}>
                <div className='pull-left'>
                  <h2>{headerText}</h2>
                </div>
                <div className='pull-right'>
                  <IconButton iconClassName="material-icons" onClick={onAdd}>add_box</IconButton>
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {tableRows}
          </TableBody>
        </Table>
      </CardText>
    </Card>
  );

  return rows.length ? card : noRowContent;
}

CardTable.propTypes = {
  headerText: React.PropTypes.string,
  tableClassName: React.PropTypes.string,
  rows: React.PropTypes.array,
  rowKey: React.PropTypes.func,
  onAdd: React.PropTypes.func
};
