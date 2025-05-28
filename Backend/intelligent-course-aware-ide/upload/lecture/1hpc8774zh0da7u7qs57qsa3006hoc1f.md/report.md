# Report

1. Implement the data loading and processing pipeline

2. Implement the SkipGram class

3. Implement the train function 

   1. Use 3000 batches as log interval

      <img src="https://p.ipic.vip/qarhna.png" style="zoom:50%;" />

   2. determine the epoch by drawing the graph → epoch 6 is good (7th) because it is the elbow point and it is the best epoch to consider both underfitting and overfitting

      <img src="https://p.ipic.vip/ija9od.png" style="zoom:72%;" />

4. Training time （Nvidia RTX4090）

   |                       | window_size = 1 | window_size = 3 |
   | --------------------- | --------------- | --------------- |
   | emb_size = 50, k = 2  | 9.47s           | 28.53s          |
   | emb_size = 100, k = 2 | 9.41s           | 29.24s          |
   | emb_size = 50, k = 5  | 9.50s           | 29.00s          |
   | emb_size = 100, k = 5 | 9.62s           | 28.45s          |

5. final results (the figures are corresponding to the table)

   <img src="https://p.ipic.vip/r1q8zh.png" style="zoom:72%;" />

   1. LSA embedding v.s. one of the embedding

      <img src="https://p.ipic.vip/xsa2km.png" style="zoom:80%;" /> <img src="https://p.ipic.vip/xwnukr.png" style="zoom:80%;" />

   2. difference: LSA embedding contains overlapping points, while word2vec model does not; values of different dimensions in LSA embedding varies in a greater range than that in word2vec embedding. 