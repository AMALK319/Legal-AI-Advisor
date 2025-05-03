import {RouteObject} from 'react-router-dom';
import { lazy } from 'react';

const DocumentUploader = lazy(() => import('./pages/Admin/DocumentUploader'));
const Chat = lazy(() => import('./pages/Public/Chat'));

export const routes: RouteObject[] = [
    {
        path: "/Admin/upload",
        element: <DocumentUploader/>
    },
    {
        path: "/",
        element: <Chat/>
    }
]