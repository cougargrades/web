/*
MIT License

Copyright (c) 2020 lucasljj@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/hexetia/react-fitty

*/

import React from 'react'
import fitty from './fitty'

const fullWidth = { width: '100%' };

// todo support style and className on Wrapper(root div) and Ref div
// one solution could be adding style prop for root and another styleProp to ref

/**
 * Snugly resizes text to fit its parent container width
 */
export const ReactFitty = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode; minSize?: number; maxSize?: number; wrapText?: boolean }
>(function ReactFitty(
    { children, minSize = 12, maxSize = 512, wrapText = false, ...rest },
    ref: React.MutableRefObject<any> | ((instance: any) => void) | null
) {
    const internalRef = React.useRef<HTMLDivElement>(null);

    /**
     * Need to use the correct ref because the component ref can contain a className that dynamically
     * change the text size
     */
    const correctRef = (ref as React.MutableRefObject<HTMLDivElement>) || internalRef;

    React.useLayoutEffect(() => {
        const effectRef = (ref as React.MutableRefObject<HTMLDivElement>) || internalRef;
        const fitInstance = fitty(effectRef!.current, {
            minSize: minSize,
            maxSize: maxSize,
            multiLine: wrapText,
            observeMutations: {
                subtree: true,
                childList: true,
                characterData: true,
                attributeFilter: ['class'],
            },
        });

        // wait browser finish text width calc with relative properties like rem and %
        // then, fit text in the next animation frame
        // maybe that needed to be handled in fitty?
        setTimeout(() => {
            fitInstance.fit();
        }, 0);

        return () => {
            fitty(effectRef.current!).unsubscribe();
        };
    }, []);

    // fitty need an extra div to avoid parent padding issue
    // see https://github.com/rikschennink/fitty/issues/20
    return (
        <div style={fullWidth}>
            <div {...rest} ref={correctRef as React.MutableRefObject<HTMLDivElement>}>
                {children}
            </div>
        </div>
    );
});
