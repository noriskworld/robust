import numpy as np
import pandas as pd

def read_and_prepare_df(path_x):
    """Read CSV file and calculate statistics for Monte Carlo simulation."""
    try:
        df_X = pd.read_csv(path_x)
        # Calculate bounds and statistics directly in pandas
        df_X['max'] = df_X['nominal'] + df_X['upper_tol']
        df_X['min'] = df_X['nominal'] + df_X['lower_tol']
        df_X['mean'] = (df_X['max'] + df_X['min']) / 2
        df_X['std'] = (df_X['max'] - df_X['min']) / (2 * df_X['sigma_level'])
        return df_X
    except FileNotFoundError:
        print("The file path specified does not exist.")
    except pd.errors.EmptyDataError:
        print("No data: The file is empty.")
    except Exception as e:
        print(f"An error occurred: {e}")
    return None

def monte_carlo_tolerancing(df_X, transf, n_simulations=1000000):
    """
    Perform Monte Carlo simulation using the specified transformation equation.
    
    Args:
    - df_X: DataFrame containing the distribution parameters for each component.
    - transf: String containing the transformation formula to evaluate.
    - n_simulations: Number of simulation runs.
    
    Returns:
    - A Data Frame containing the simulation results.
    """
    # Create a DataFrame for the simulation where each column corresponds to a component name
    # and contains simulated values based on the specified normal distribution parameters.
    df = pd.DataFrame({
        row['name']: np.random.normal(row['mean'], row['std'], n_simulations)
        for _, row in df_X.iterrows()
    })
    
    # Apply the transformation formula to the DataFrame using eval
    df = df.eval(transf)
    
    # Return the descriptive statistics for the results
    return df
