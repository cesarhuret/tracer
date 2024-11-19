import * as React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemContentSpan } from '../helpers';

type TraceTreeItemProps = {
    nodeId: string;

    treeContent: JSX.Element | JSX.Element[];

    children?: JSX.Element[];
};

type TraceTreeNodeLabelProps = {
    nodeType: string;
    onNodeClick?: React.MouseEventHandler<HTMLElement>;
};

export const TraceTreeNodeLabel = (props: TraceTreeNodeLabelProps) => {
    const { nodeType, onNodeClick } = props;

    return (
        <span
            onClick={onNodeClick}
            style={{
                cursor: onNodeClick ? 'pointer' : 'inherit',
            }}
        >
            [{nodeType}]
        </span>
    );
};

export const TraceTreeItem = (props: TraceTreeItemProps) => {
    const { nodeId, treeContent, children } = props;

    return (
        <TreeItem
            nodeId={nodeId}
            TransitionProps={{
                mountOnEnter: true,
                unmountOnExit: false,
            }}
            sx={{
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                    width: 1,
                },
                '&::-webkit-scrollbar-track': {
                    background: '#000',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },
            }}
            label={<TreeItemContentSpan>{treeContent}</TreeItemContentSpan>}
        >
            {children}
        </TreeItem>
    );
};
