import React, { Fragment } from 'react';
import { IconButton } from '@mui/joy';
import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import html2canvas from "html2canvas";

/**
 * creates a screenshot of the app surface. this method expects a
 * reference to the parent view that will be turned into an image.
 * usage:
 *
 * import { Screenshot } from "@screen-shot/screenshot";
 *     <Screenshot />
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Screenshot2 = () => {
    const exportAsImage = async (element, imageFileName) => {
        const html = document.getElementsByTagName("html")[0];
        const body = document.getElementsByTagName("body")[0];

        let htmlWidth = html.clientWidth;
        let bodyWidth = body.clientWidth;

        const newWidth = element.scrollWidth - element.clientWidth;

        if (newWidth > element.clientWidth) {
            htmlWidth += newWidth;
            bodyWidth += newWidth;
        }

        html.style.width = htmlWidth + "px";
        body.style.width = bodyWidth + "px";

        const canvas = await html2canvas(body);
        const image = canvas.toDataURL("image/png", 1.0);

        downloadImage(image, imageFileName);

        html.style.width = null;
        body.style.width = null;
    };

    const downloadImage = (blob, fileName) => {
        const fakeLink = window.document.createElement("a");
        fakeLink.style = "display:none;";
        fakeLink.download = fileName;

        fakeLink.href = blob;

        document.body.appendChild(fakeLink);
        fakeLink.click();
        document.body.removeChild(fakeLink);

        fakeLink.remove();
    };

    // render the button to download the image
    return (
        <Fragment>
            <IconButton sx={{ marginLeft: 2 }} onClick={ () => exportAsImage(document.body, 'test') }>
                <AddAPhotoRoundedIcon  color={'primary'} />
            </IconButton>
        </Fragment>
    );
};