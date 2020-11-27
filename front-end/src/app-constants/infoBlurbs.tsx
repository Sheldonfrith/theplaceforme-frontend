import React from 'react';
type allowedInfoBlurbNames = 'idealValue'|'normalizationPercentage'|'weight'|'missingDataHandlerMethod';

export default function getInfoDiv (type: allowedInfoBlurbNames){

    switch (type) {
        case 'idealValue':
            return (<div>Move the slider or input a value directly. Countries that are closer to the value you choose here
            will get higher scores and be ranked higher in the final results.
            The graph above the slider show the distribution of countries within the dataset.
            The number at the top right shows the percentage of countries that are missing data for this dataset.</div>);
        case 'normalizationPercentage':
            return (<div>User the slider on input a number directly to choose what percentage of 'normalization' to apply to the results
            of this question.
            Normalization spreads out the distribution of countries. It should be used for datasets/questions that are 
            highly 'skewed'. Look at the graph for this question... if all of the countries are concentrated in one or 
            two parts of the graph with almost no countries in other parts of the graph, then you should probably
            apply normalization. I would recommend between 50 and 75% for very uneven country distributions,
            and 0-25% for fairly even distributions. If you understand what normalization does you can choose
            any value even up to 100% (which completely spreads out all countries evenly along the range of scores).
            The more normalization you apply, the more
            that slight differences between countries 
            will matter, and the less large differences will matter. See the <a href={'https://github.com/Sheldonfrith/theplaceforme-backend/wiki/Methodology'}>Methodology</a>
            page for more info on how the normalization works.</div>); 

        case 'weight':
            return (
                <div>
                Use the slider or input a value directly to set the 'weight' that this question will have 
                relative to all other questions.
                If you set the weight value to 0 then this question will not
                be counted in your final results, therefore you cannot pick an 'ideal value' or any 
                advanced options unless you pick an importance above 0. The scores for this question are MULTIPLIED by the 
                weight you give here, so a question with an weight of "50" will influence
                your final results 50 X more than a question with an weight of "1", so use
                this slider carefully!</div>
            );
        case 'missingDataHandlerMethod':
            return (
                <div>
                    Choose how to handle countries that have no data for this dataset.
                    See our <a href={'https://github.com/Sheldonfrith/theplaceforme-backend/wiki/Methodology'}>Methodology</a> page for more info about these different methods
                    for handling countries with missing data.
                </div>
            );
        default:
            break;
    }
}    