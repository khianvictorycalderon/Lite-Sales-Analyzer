import { useEffect, useState } from "react";

export default function App() {
  // Anti-Adblocker
  const [isAdBlockerEnabled, setIsAdBlockerEnabled] = useState<boolean>(false);
  const [page, setPage] = useState<string>("home");
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to manage validation error

  useEffect(() => {
    const testAdBlocker = () => {
      const adScript = document.createElement('script');
      adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      adScript.async = true;
      adScript.onload = () => {
        setIsAdBlockerEnabled(false);
      };
      adScript.onerror = () => {
        setIsAdBlockerEnabled(true);
      };
      document.body.appendChild(adScript);
      return () => {
        if (document.body.contains(adScript)) {
          document.body.removeChild(adScript);
        }
      };
    };
    testAdBlocker();
  }, []);

  const [investments, setInvestments] = useState<string>('');
  const [revenues, setRevenues] = useState<string>('');
  const inputSplitter = /[\n,]/;

  const Random = (min: number, max: number): number => {
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const predictFutureSales = (revenues: number[]): string[] => {
    const n = revenues.length;
    if (n < 5) return []; // Ensure there are at least 5 values

    // Calculate slope (m) and intercept (b) for y = mx + b
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
        const x = i + 1; // Month as x (1 to n)
        const y = revenues[i]; // Revenue as y
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate next 20 sales predictions
    const predictions: string[] = [];
    for (let i = n + 1; i <= n + 20; i++) {
        const predictedValue = slope * i + intercept;
        predictions.push(predictedValue.toFixed(2)); // Round to 2 decimal places
    }
    return predictions;
  };


  // Analysis variables:
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(0);
  const [sustainability, setSustainability] = useState<string>("");
  const [roi, setRoi] = useState<number>(0);
  const [revenueInvestmentRatio, setRevenueInvestmentRatio] = useState<number>(0);
  const [profitabilityIndex, setProfitabilityIndex] = useState<string>("");
  const [isPredictSales, setPredictSales] = useState<boolean>(false);
  const [salesPredictions, setSalesPredictions] = useState<string[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!investments.trim() || !revenues.trim()) {
      setErrorMessage('Both investments and revenues fields are required.');
      return;
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage("loading");

    // Analysis here, while loading screen is being displayed

      // Total Investment
      const investmentsArray = investments.split(inputSplitter).map(val => parseFloat(val.trim()));
      const investmentSum = investmentsArray.reduce((sum, value) => sum + value, 0);
      setTotalInvestment(prevTotal => prevTotal + investmentSum);

      // Total Revenue
      const revenuesArray = revenues.split(inputSplitter).map(val => parseFloat(val.trim()));
      const revenueSum = revenuesArray.reduce((sum, value) => sum + value, 0);
      setTotalRevenue(prevTotal => prevTotal + revenueSum);

      // Profit-Dependent analysis
      setProfit(prev => {
        // Profit Calculation
        const newProfit = prev + revenueSum - investmentSum;
        const newRevenueTotal = totalRevenue + revenueSum;
    
        // Profit Margin Calculation
        const newProfitMargin = newRevenueTotal > 0 ? (newProfit / newRevenueTotal) * 100 : 0;
        setProfitMargin(newProfitMargin);
    
        // Sustainability Assessment
        let sustainability;
        if (newProfitMargin <= 5) {
            sustainability = "Low";
        } else if (newProfitMargin <= 10) {
            sustainability = "Moderate";
        } else if (newProfitMargin <= 15) {
            sustainability = "Fair";
        } else if (newProfitMargin <= 20) {
            sustainability = "Good";
        } else {
            sustainability = "Excellent";
        }
        setSustainability(sustainability);
    
        // Return on Investment Calculation
        setRoi(prev => prev + (((revenueSum - investmentSum) / investmentSum) * 100));
    
        // Revenue to Investment Ratio Calculation
        const revenueInvestmentRatioResult = revenueSum / investmentSum; // Use current values directly
        setRevenueInvestmentRatio(prev => prev + revenueInvestmentRatioResult);
    
        // Profitability Index Calculation
        const profitabilityIndexMessage = revenueInvestmentRatioResult > 1 
            ? "With the Revenue to Investment ratio greater than 1.99, therefore it is PROFITABLE" 
            : "With the Revenue to Investment NOT ratio greater than 1.99, therefore it is NOT PROFITABLE";
        setProfitabilityIndex(profitabilityIndexMessage);
    
        // This is the end, do not add new metric analysis below here
        return newProfit;
      });

      // Sales Prediction
      if (revenuesArray.length >= 5) {
        setPredictSales(true);
        const predictions = predictFutureSales(revenuesArray);
        setSalesPredictions(predictions); // Store the predictions in state correctly
      } else {
        setPredictSales(false);
      }
    
    // Analysis end, display now after the timeout

    setTimeout(() => {
      setPage("output");
    },Random(500, 3000));
  };

  const handleAnalyzeAgain = () => {
    setTotalInvestment(0);
    setTotalRevenue(0);
    setProfit(0);
    setProfitMargin(0);
    setSustainability("");
    setRoi(0);
    setRevenueInvestmentRatio(0);
    setProfitabilityIndex("");
    setPredictSales(false);

    setInvestments('');
    setRevenues('');
    setErrorMessage(null);
    setPage("home");
  };

  const disableMessageStyle: React.CSSProperties = {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "90vw",
    margin: "auto",
  };

  const privacy = `
  <h4>Privacy Policy</h4>
  <p class="justify">
    At Lite Sales Analyzer, we respect your privacy. This privacy policy is designed to show you how we use the information that you might have provided to us while using our website. Please know that Lite Sales Analyzer does not collect, store, or share user personal information and data. Our website functions without track data and gathering identifiable data.
    <br/><br/>
    Lite Sales Analyzer is free analytical tool that will assist users in the efficient analysis of sales data. Since no data is collected by our service, your privacy is respected at all times. We suggest you should be aware of your rights with respect to such privacy.
  </p>
  `;

  const terms = `
  <h4>Terms and Conditions</h4>
  <p class="justify">
    Use of Lite Sales Analyzer allows you to agree to be bound by and to abide by the terms and conditions of use. These terms shall govern your use of this website, the services it provides which are for lawful purposes only.
    <br/><br/>
    Lite Sales Analyzer is free. To support the service rendered, we may place advertisements on the website. We know you do not like getting bombarded with ads, so we have minimized the ads that appear on this site. We need these ads to ensure that our website stays as recent and running smoothly as possible, making free use of all our tools available to all of you. We are in no way responsible for the content of any ad you see on our site and also bear no control over dealings you may have with third-party advertisers.
    <br/><br/>
    Accepting and use of our Lite Sales Analyzer is considered to mean that you have read, understood, and are agreeing to this privacy policy and these terms and conditions. You must not use this website if you do not agree with any of the terms.
  </p>
  `;

  const AnalysisData = [
    {
        title: "Total Investment",
        data: totalInvestment.toFixed(2)
    },
    {
        title: "Total Revenue",
        data: totalRevenue.toFixed(2)
    },
    {
        title: "Over-All Profit",
        data: `${profit.toFixed(2)}`
    },
    {
        title: "Profit Margin",
        data: `${profitMargin.toFixed(2)}%`
    },
    {
      title: "Sustainability",
      data: `With ${profitMargin.toFixed(2)}% profit margin, the sustainability is ${sustainability}`
    },
    {
      title: "Return of Investment",
      data: `${roi.toFixed(2)}%`
    },
    {
      title: "Revenue to Investment Ratio",
      data: revenueInvestmentRatio.toFixed(2)
    },
    {
      title: "Profitability Index",
      data: profitabilityIndex
    }
  ];
  return (
    <>
      {!isAdBlockerEnabled && 
        <>
          <div className="fs-6">
            <div id="menu">
              L I T E - S A L E S - A N A L Y Z E R
            </div>
            <div id="main-content">
              {page == "home" && 
                <>
                  <p className="center">
                  <h1>Analyze your sales!</h1>
                  </p>
                  <hr />
                  <form onSubmit={handleSubmit}>
                    <i>(Use comma or new line but not both to separate multiple values)</i><br />
                    <i>(To predict the possible next 20 future sales, five or more revenue is needed, the more the revenue the more accurate the prediction)</i><br/>
                    <br />
                    <label className="form-label w-100">
                      <span className="fs-4">Amount of Investment/s:</span> <br />
                      <textarea
                        className="form-control fs-4 input-dark"
                        placeholder="Example: 1, 2, 3... "
                        rows={5}
                        value={investments}
                        onChange={(e) => setInvestments(e.target.value)}
                      />
                    </label>
                    <br /><br />
                    <label className="form-label w-100">
                      <span className="fs-4">Amount of Revenue/s:</span> <br />
                      <textarea
                        className="form-control fs-4 input-dark"
                        placeholder="Example: 1, 2, 3... "
                        rows={5}
                        value={revenues}
                        onChange={(e) => setRevenues(e.target.value)}
                      />
                    </label>
                    <br/><br/>
                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                    <input
                      type="submit"
                      className="fs-4 form-control btn btn-primary"
                      value="Analyze"
                    />
                  </form>
                </>
              }
              {page == "loading" && 
                <h4 className="center">
                  Loading... Please wait while we analyze your data...
                </h4>
              }
              {page == "output" &&
                <div className="fs-4">
                  Analysis complete, here are the results: <hr/>
                  <div className="container">
                    {AnalysisData.map((item, index) => 
                        (<>
                          <div className="row center" key={index}>
                            <div className="col list-group-item center-v">
                              {item.title}
                            </div>
                            <div className="col center-v">
                              {item.data}
                            </div>
                          </div>
                          <hr/>
                        </>))
                    }
                    <br/>
                    {!isPredictSales &&
                      <>
                       To predict future sales, five or more revenue is needed.
                      </>
                    }
                    {isPredictSales &&
                      <>
                        Based from your revenues, here are possible next 20 predictions of your future sales:
                        {salesPredictions.map((prediction, index) => (
                          <div key={index}>
                            Next {index + 1}th Sale: {prediction}
                          </div>
                        ))}
                      </>
                    }
                  </div>
                  <br/>
                  <button onClick={handleAnalyzeAgain} className="btn btn-primary w-100 fs-4">Analyze again</button>
                </div>
              }
            </div>
            <div id="container-3f35bea086f9930a8a2d68d15e8f0e51"></div>
            <div id="notice">
              <hr/> 
              <div dangerouslySetInnerHTML={{__html: privacy}} />
              <hr/>
              <div dangerouslySetInnerHTML={{__html: terms}} />
            </div>
            <footer>
              Website created by: <a href="https://khian.netlify.app/">Khian Victory D. Calderon</a><br/>
              <a href="https://khianvictorycalderon.github.io/donation/donate.html">Donate to Khian</a>.<br/>
              All rights reserved 2024.
            </footer>
          </div>
        </>
      }
      {isAdBlockerEnabled && (
        <div style={{ ...disableMessageStyle }}>
          <h4>
            Please disable your ad blocker to access this website. <br />
            We depend on ads to keep this service free for you.
          </h4>
        </div>
      )}
    </>
  );
}
